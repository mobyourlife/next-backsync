import {
  connectToFacebookDatabase,
  facebookCheckPages,
  loop,
  prepareBatchItems,
  prepareBatchLots
} from './lib'

function main() {
  Promise.all([
    connectToFacebookDatabase()
  ]).then(data => {
    let [db] = data
    
    loop(() => facebookCheckPages(db).then(pages => prepareBatchItems(db, pages)), 5)
    loop(() => prepareBatchLots(db), 1)
  })
}

main()
