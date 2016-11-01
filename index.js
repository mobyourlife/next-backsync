import {
  connectToFacebookDatabase,
  facebookCheckPages,
  loop,
  prepareBatchItems
} from './lib'

function main() {
  Promise.all([
    connectToFacebookDatabase()
  ]).then(data => {
    let [db] = data
    
    loop(() =>
      facebookCheckPages(db).then(pages => prepareBatchItems(db, pages))
    , 60)
  })
}

main()
