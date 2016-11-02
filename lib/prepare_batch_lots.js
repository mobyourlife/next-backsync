const ObjectId = require('mongodb').ObjectID

export function prepareBatchLots(db) {
  return new Promise((resolve, reject) => {
    try {
      const batch_items = db.collection('batch_items')
      batch_items.find({ 'log.queued': null })
      .sort({ _id: -1 })
      .limit(50)
      .map(function (i) { return i._id }).toArray((err, docs) => {
        if (err) {
          reject('Unable to prepare batch lots!' + err)
        } else {
          if (docs.length > 0) {
            batch_items.updateMany(
              { _id: { $in: docs } },
              { $set: { log: { queued: new Date() } } },
              { multi: true },
              (err, result) => {
                if (err) {
                  reject('Unable to updated batch items queued time!' + err)
                } else {
                  resolve(docs)
                }
              })
          } else {
            reject('No items to queue right now!')
          }
        }
      })
    } catch(err) {
      reject(err)
    }
  })
}
