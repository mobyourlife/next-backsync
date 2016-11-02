import {
  connectToFacebookDatabase,
  connectToMessageQueue,
  consumeQueue,
  produceQueue,
  facebookCheckPages,
  fetchBatchRequests,
  loop,
  prepareBatchItems,
  prepareBatchLots
} from './lib'

function main() {
  const BATCH_LOTS_QUEUE = 'batch_lots'

  Promise.all([
    connectToFacebookDatabase(),
    connectToMessageQueue()
  ]).then(data => {
    let [db, ch] = data
    
    loop(() => facebookCheckPages(db).then(pages => prepareBatchItems(db, pages)), 5)
    loop(() => prepareBatchLots(db).then(lot => produceQueue(ch, BATCH_LOTS_QUEUE, lot)), 5)

    consumeQueue(ch, BATCH_LOTS_QUEUE, fetchBatchRequests)
  })
}

main()
