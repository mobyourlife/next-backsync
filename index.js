import { loop } from './commons'

import {
  connectToFacebookDatabase,
  facebookCheckPages
} from './facebook'

function main() {
  Promise.all([
    connectToFacebookDatabase()
  ]).then(data => {
    let db
    [db] = data

    loop(() => facebookCheckPages(db), 5000)
  })
}

main()
