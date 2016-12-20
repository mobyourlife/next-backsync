import { builderCheckModifications, facebookCheckPages, facebookCheckAlbums, facebookCheckFeed, facebookCheckPhotos, loop, prepareBatchItems, prepareBatchLots } from './backsync'
import { connectToFacebookDatabase, storeError, storeObject, STORE_OBJECT_QUEUE } from './database'
import { batchRequest } from './facebook'
import { connectToMessageQueue, consumeQueue, produceQueue } from './mq'

const Lynx = require('lynx')
const metrics = new Lynx(process.env.MOB_TELEGRAF_HOSTNAME, 8125)

header()
main()

function main() {
  const BATCH_LOTS_QUEUE = 'batch_lots'
  const BATCH_ERRORS_QUEUE = 'batch_errors'
  const BUILD_SITES_QUEUE = 'build_sites'

  Promise.all([
    connectToFacebookDatabase(),
    connectToMessageQueue()
  ]).then(data => {
    let [db, ch] = data

    loop(() => facebookCheckPages(db).then(pages => prepareBatchItems(db, pages)), 5)
    loop(() => facebookCheckAlbums(db).then(albums => prepareBatchItems(db, albums)), 5)
    loop(() => facebookCheckPhotos(db).then(photos => prepareBatchItems(db, photos)), 5)
    loop(() => facebookCheckFeed(db).then(feed => prepareBatchItems(db, feed)), 5)

    loop(() => prepareBatchLots(db).then(lot => produceQueue(ch, BATCH_LOTS_QUEUE, lot)), 5)
    loop(() => builderCheckModifications(db).then(list => list.map(id => produceQueue(ch, BUILD_SITES_QUEUE, id))), 5)

    consumeQueue(ch, BATCH_LOTS_QUEUE).subscribe(res => {
      const { data, ack } = res
      metrics.increment('queue.batch_lots.consume.ok')
      console.log('Consumed', data.length, 'items from the observable')
      batchRequest(data).then(res => {
        metrics.increment('facebook.batch_request.ok')
        const promises = res.map(i => produceQueue(ch, STORE_OBJECT_QUEUE, i))
        return Promise.all(promises).then(ack => {
          metrics.increment('queue.store_object.produce.ok')
          ack()
        }, err => {
          metrics.increment('queue.store_object.produce.err')
        })
      }, err => {
        console.error(err)
        metrics.increment('facebook.batch_request.err')
        return produceQueue(ch, BATCH_ERRORS_QUEUE, err).then(ack)
      })
    }, err => {
      console.error(err)
      metrics.increment('queue.batch_lots.consume.err')
      produceQueue(ch, BATCH_ERRORS_QUEUE, err)
    })

    consumeQueue(ch, STORE_OBJECT_QUEUE).subscribe(res => {
      const { data, ack } = res
      console.log('Received response')
      return storeObject(db, data).then(ack => {
        metrics.increment('queue.store_object.consume.ok')
        ack()
      }, err => {
        metrics.increment('queue.store_object.consume.err')
      })
    })
  })
}

function header() {
  console.log('')
  console.log('=== MOB YOUR LIFE ===')
  console.log(new Date().toISOString() + ' - Back Sync running...')
  console.log('')
}
