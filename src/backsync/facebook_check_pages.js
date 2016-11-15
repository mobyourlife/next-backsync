export function facebookCheckPages(db) {
  return new Promise((resolve, reject) => {
    try {
      const pages = db.collection('pages')
      pages.find({
        active: true,
        $or: [
          { 'log.check_page': null },
          { 'log.check_page': {$lt: new Date(new Date().getTime() - 1 * 60 * 1000)} }
        ]
      }).toArray((err, docs) => {
        if (err) {
          reject('Unable to check pages from database!' + err)
        } else {
          resolve(docs)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
