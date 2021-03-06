export function prepareBatchItems(db, res) {
  return new Promise((resolve, reject) => {
    const { endpoints, set_date, fields } = res

    if (!endpoints || endpoints.length === 0) {
      resolve()
      return
    }

    try {
      const batch_items = db.collection('batch_items')
      const items = endpoints.map(i => {
        return {
          fb_request_type: i.fb_request_type,
          fb_account_id: i.fb_account_id,
          fb_album_id: i.fb_album_id,
          method: 'GET',
          relative_url: `${i.url}?fields=${fields}`
        }
      })
      batch_items.insertMany(items, (err, result) => {
        if (err) {
          reject('Unable to prepare batch items!' + err)
        } else {
          const ids = endpoints.map(i => i._id)
          const pages = db.collection(set_date.collection)
          let update_date = {}
          update_date[set_date.property] = new Date()

          pages.updateMany(
            { _id: { $in: ids } },
            { $set: update_date },
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
