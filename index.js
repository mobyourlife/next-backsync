import { loop } from './commons'

import {
  connectToFacebookDatabase,
  facebookCheckPages
} from './facebook'

function main() {
  let db
  connectToFacebookDatabase((db, done) => {
    loop(() => {
      return facebookCheckPages(db)
    }, 5000)
  })
}

main()
