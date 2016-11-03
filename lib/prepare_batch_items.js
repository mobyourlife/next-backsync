export function prepareBatchItems(db, inpages) {
  return new Promise((resolve, reject) => {
    if (!inpages || inpages.length === 0) {
      resolve()
      return
    }

    try {
      const batch_items = db.collection('batch_items')
      const items = inpages.map(i => {
        return {
          method: 'GET',
          relative_url: `${i.fb_account_id}`
        }
      })
      batch_items.insertMany(items, (err, result) => {
        if (err) {
          reject('Unable to prepare batch items!' + err)
        } else {
          const ids = inpages.map(i => i._id)
          const pages = db.collection('pages')
          pages.updateMany(
            { _id: { $in: ids} },
            { $set: { log: { check_page: new Date() } } },
            (err, result) => {
              if (err) {
                reject('Unable to update checked pages statuses!' + err)
              } else {
                resolve(items)
              }
            }
          )
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
