export function facebookCheckAlbums(db) {
  return new Promise((resolve, reject) => {
    try {
      const pages = db.collection('pages')
      pages.find({
        active: true,
        'log.check_page': {$gt: new Date(new Date().getTime() - 5 * 60 * 1000)},
        $or: [
          { 'log.check_albums': null },
          { 'log.check_albums': {$lt: new Date(new Date().getTime() - 5 * 60 * 1000)} }
        ]
      }, { fb_account_id: 1 }).toArray((err, docs) => {
        if (err) {
          reject('Unable to check albums from database!' + err)
        } else {
          resolve({
            endpoints: docs.map(i => {
              return {
                _id: i._id,
                url: i.fb_account_id + '/albums'
              }
            }),
            datefield: 'log.check_albums',
            fields: [
              'location',
              'message',
              'name',
              'place',
              'privacy'
            ].join(',')
          })
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
