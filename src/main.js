import { facebookCheckPages, loop, prepareBatchItems, prepareBatchLots } from './backsync'
import { connectToFacebookDatabase } from './database'
import { batchRequest } from './facebook'
import { connectToMessageQueue, consumeQueue, produceQueue } from './mq'

function main() {
  const BATCH_LOTS_QUEUE = 'batch_lots'

  Promise.all([
    connectToFacebookDatabase(),
    connectToMessageQueue()
  ]).then(data => {
    let [db, ch] = data
    
    loop(() => facebookCheckPages(db).then(pages => prepareBatchItems(db, pages)), 5)
    loop(() => prepareBatchLots(db).then(lot => produceQueue(ch, BATCH_LOTS_QUEUE, lot)), 5)

    consumeQueue(ch, BATCH_LOTS_QUEUE).subscribe(data => {
      console.log('Consumed', data.length, 'items from the observable')
      batchRequest(data).then(res => {
        console.log('Finished batch request', res)
      }, err => {
        console.error(err)
      })
    }, err => {
      console.error(err)
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
