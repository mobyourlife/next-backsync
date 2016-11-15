import { facebookCheckPages, facebookCheckAlbums, loop, prepareBatchItems, prepareBatchLots } from './backsync'
import { connectToFacebookDatabase, storeError, storeObject, STORE_OBJECT_QUEUE } from './database'
import { batchRequest } from './facebook'
import { connectToMessageQueue, consumeQueue, produceQueue } from './mq'

function main() {
  const BATCH_LOTS_QUEUE = 'batch_lots'
  const BATCH_ERRORS_QUEUE = 'batch_errors'

  Promise.all([
    connectToFacebookDatabase(),
    connectToMessageQueue()
  ]).then(data => {
    let [db, ch] = data
    
    loop(() => facebookCheckPages(db).then(pages => prepareBatchItems(db, pages)), 5)
    loop(() => facebookCheckAlbums(db).then(pages => prepareBatchItems(db, pages)), 5)

    loop(() => prepareBatchLots(db).then(lot => produceQueue(ch, BATCH_LOTS_QUEUE, lot)), 5)

    consumeQueue(ch, BATCH_LOTS_QUEUE).subscribe(res => {
      const { data, ack } = res
      console.log('Consumed', data.length, 'items from the observable')
      batchRequest(data).then(res => {
        const promises = res.map(i => produceQueue(ch, STORE_OBJECT_QUEUE, i))
        return Promise.all(promises).then(ack)
      }, err => {
        console.error(err)
        return produceQueue(ch, BATCH_ERRORS_QUEUE, err).then(ack)
      })
    }, err => {
      console.error(err)
      produceQueue(ch, BATCH_ERRORS_QUEUE, err)
    })

    consumeQueue(ch, STORE_OBJECT_QUEUE).subscribe(res => {
      const { data, ack } = res
      console.log('Received response')
      return storeObject(db, data).then(ack)
    })
  })
}

function header() {
  console.log('')
  console.log('=== MOB YOUR LIFE ===')
  console.log(new Date().toISOString() + ' - Back Sync running...')
  console.log('')
}

header()
main()
