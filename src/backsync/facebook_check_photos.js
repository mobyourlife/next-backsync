export function facebookCheckPhotos(db) {
  return new Promise((resolve, reject) => {
    try {
      const albums = db.collection('albums')
      albums.find({
        $or: [
          { 'log.check_photos': null },
          { 'log.check_photos': {$lt: new Date(new Date().getTime() - 5 * 60 * 1000)} }
        ]
      }, { fb_account_id: 1, fb_album_id: 1 }).toArray((err, docs) => {
        if (err) {
          reject('Unable to check photos from database!' + err)
        } else {
          resolve({
            endpoints: docs.map(i => {
              return {
                _id: i._id,
                fb_request_type: 'photo',
                fb_account_id: i.fb_account_id,
                fb_album_id: i.fb_album_id,
                url: i.fb_album_id + '/photos'
              }
            }),
            datefield: 'log.check_albums',
            set_date: {
              collection: 'albums',
              property: 'log.check_photos'
            },
            fields: [
              'id',
              'backdated_time',
              'created_time',
              'height',
              'images',
              'link',
              'name',
              'place',
              'updated_time',
              'width'
            ].join(',')
          })
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
