import { connectToFacebookDatabase } from './commons'

export function facebookCheckPages() {
  return new Promise((resolve, reject) => {
    try {
      connectToFacebookDatabase((db, done) => {
        const pages = db.collection('pages')
        pages.find({}).toArray((err, docs) => {
          if (err) {
            reject('Unable to check pages from database!', err)
          } else {
            resolve(docs)
          }
          done()
        })
      })
    } catch (err) {
      reject(err)
    }
  })
}
