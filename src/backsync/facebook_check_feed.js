export function facebookCheckFeed(db) {
  return new Promise((resolve, reject) => {
    try {
      const pages = db.collection('pages')
      pages.find({
        active: true,
        'log.check_page': {$gt: new Date(new Date().getTime() - 5 * 60 * 1000)},
        $or: [
          { 'log.check_feed': null },
          { 'log.check_feed': {$lt: new Date(new Date().getTime() - 5 * 60 * 1000)} }
        ]
      }, { fb_account_id: 1 }).toArray((err, docs) => {
        if (err) {
          reject('Unable to check feed from database!' + err)
        } else {
          resolve({
            endpoints: docs.map(i => {
              return {
                _id: i._id,
                fb_request_type: 'feed',
                fb_account_id: i.fb_account_id,
                url: i.fb_account_id + '/feed'
              }
            }),
            set_date: {
              collection: 'pages',
              property: 'log.check_feed'
            },
            fields: [
              'id',
              'caption',
              'created_time',
              'description',
              'from',
              'full_picture',
              'is_hidden',
              'is_published',
              'link',
              'message',
              'message_tags',
              'name',
              'object_id',
              'parent_id',
              'permalink_url',
              'picture',
              'properties',
              'source',
              'status_type',
              'story',
              'type',
              'updated_time'
            ].join(',')
          })
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
