export function facebookCheckPages(db) {
  return new Promise((resolve, reject) => {
    try {
      const pages = db.collection('pages')
      pages.find({
        active: true,
        $or: [
          { 'log.check_page': null },
          { 'log.check_page': {$lt: new Date(new Date().getTime() - 5 * 60 * 1000)} }
        ]
      }, { fb_account_id: 1 }).toArray((err, docs) => {
        if (err) {
          reject('Unable to check pages from database!' + err)
        } else {
          resolve({
            endpoints: docs.map(i => {
              return {
                _id: i._id,
                fb_request_type: 'page',
                fb_account_id: i.fb_account_id,
                url: i.fb_account_id
              }
            }),
            set_date: {
              collection: 'pages',
              property: 'log.check_page'
            },
            fields: [
              'id',
              'about',
              'category',
              'category_list',
              'cover',
              'description',
              'emails',
              'engagement',
              'fan_count',
              'is_published',
              'is_verified',
              'is_webhooks_subscribed',
              'link',
              'location',
              'name',
              'overall_star_rating',
              'phone',
              'rating_count',
              'talking_about_count',
              'username',
              'verification_status',
              'voip_info',
              'were_here_count'
            ].join(',')
          })
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
