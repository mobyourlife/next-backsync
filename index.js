import { loop } from './commons'

import {
  connectToFacebookDatabase,
  facebookCheckPages
} from './facebook'

function main() {
  let db
  connectToFacebookDatabase((db, done) => {
    loop(facebookCheckPages, 5000, db)
  })
}

main()
