import {
  facebookCheckPages,
  loop,
  prepareBatchItems,
  prepareBatchLots
} from './lib'

import {
  connectToFacebookDatabase,
  connectToMessageQueue,
  consumeQueue,
  produceQueue
} from './providers'

function main() {
  const BATCH_LOTS_QUEUE = 'batch_lots'

  Promise.all([
    connectToFacebookDatabase(),
    connectToMessageQueue()
  ]).then(data => {
    let [db, ch] = data
    
    loop(() => facebookCheckPages(db).then(pages => prepareBatchItems(db, pages)), 5)
    loop(() => prepareBatchLots(db).then(lot => produceQueue(ch, BATCH_LOTS_QUEUE, lot)), 5)

    // consumeQueue(ch, BATCH_LOTS_QUEUE, fetchBatchRequests)
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
