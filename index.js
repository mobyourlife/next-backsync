import {
  connectToFacebookDatabase,
  facebookCheckPages
} from './facebook'

function main() {
  let db
  connectToFacebookDatabase((db, done) => {
    loop(db).then(() => done())
  })
}

function loop(db) {
  const checkPages = facebookCheckPages(db).then(console.log)

  return Promise.all([
    checkPages
  ])
}

main()
