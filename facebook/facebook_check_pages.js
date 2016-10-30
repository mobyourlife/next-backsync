export function facebookCheckPages(db) {
  return new Promise((resolve, reject) => {
    try {
      const pages = db.collection('pages')
      pages.find({}).toArray((err, docs) => {
        if (err) {
          reject('Unable to check pages from database!', err)
        } else {
          resolve(docs)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
