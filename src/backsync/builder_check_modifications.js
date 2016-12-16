const ObjectId = require('mongodb').ObjectID

export function builderCheckModifications(db) {
  return new Promise((resolve, reject) => {
    try {
      const pages = db.collection('pages')
      pages.find({
        active: true,
        'log.last_modified': {$ne: null},
        'log.build_updated': {$ne: true},
        $or: [
          { 'log.build_queued': null },
          { 'log.build_queued': {$lt: new Date(new Date().getTime() - 5 * 60 * 1000)} }
        ]
      }, { fb_account_id: 1 }).toArray((err, docs) => {
        if (err) {
          reject('Unable to check pages modifications!' + err)
        } else {
          if (docs.length > 0) {
            const ids = docs.map(i => i._id)
            pages.updateMany(
              { _id: { $in: ids } },
              { $set: { 'log.build_queued': new Date() } },
              { multi: true },
              (err, result) => {
                if (err) {
                  reject('Unable to updated pages build queue time!' + err)
                } else {
                  resolve(docs)
                }
              })
          } else {
            reject('No pages to build yet!')
          }
        }
      })
    } catch(err) {
      reject(err)
    }
  })
}
