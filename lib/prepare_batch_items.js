export function prepareBatchItems(db, items) {
  return new Promise((resolve, reject) => {
    try {
      const batch_items = db.collection('batch_items')
      batch_items.insertMany(items, (err, result) => {
        if (err) {
          reject('Unable to prepare batch items!', err)
        } else {
          resolve(result)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
