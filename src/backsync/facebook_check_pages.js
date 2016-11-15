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
      }).toArray((err, docs) => {
        if (err) {
          reject('Unable to check pages from database!' + err)
        } else {
          resolve({
            inpages: docs,
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
