import {
  connectToFacebookDatabase,
  connectToMessageQueue,
  consumeQueue,
  facebookCheckPages,
  fetchBatchRequests,
  loop,
  prepareBatchItems,
  prepareBatchLots
} from './lib'

function main() {
  Promise.all([
    connectToFacebookDatabase(),
    connectToMessageQueue()
  ]).then(data => {
    let [db, ch] = data
    
    loop(() => facebookCheckPages(db).then(pages => prepareBatchItems(db, pages)), 5)
    loop(() => prepareBatchLots(db, ch), 1)

    consumeQueue(ch, 'batch_lots', fetchBatchRequests)
  })
}

main()
