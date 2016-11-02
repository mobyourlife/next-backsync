const ObjectId = require('mongodb').ObjectID

export function prepareBatchLots(db) {
  return new Promise((resolve, reject) => {
    try {
      const batch_items = db.collection('batch_items')
      batch_items.find({ lot: null })
      .sort({ _id: -1 })
      .limit(50)
      .map(function (i) { return i._id }).toArray((err, docs) => {
        if (err) {
          reject('Unable to prepare batch lots!' + err)
        } else {
          if (docs.length > 0) {
            const lot_number = ObjectId()
            const batch_lots = db.collection('batch_lots')
            batch_lots.insert({ _id: lot_number, items: docs }, (err, result) => {
              if (err) {
                reject('Unable to create batch lot!' + err)
              } else {
                batch_items.updateMany(
                  { _id: { $in: docs } },
                  { $set: { lot: lot_number } },
                  { multi: true },
                  (err, result) => {
                    if (err) {
                      reject('Unable to updated batch items lot number!' + err)
                    } else {
                      resolve(result)
                    }
                  })
              }
            })
          } else {
            resolve(null)
          }
        }
      })
    } catch(err) {
      reject(err)
    }
  })
}
