const ObjectID = require('mongodb').ObjectID

export const STORE_OBJECT_QUEUE = 'store_object'
export const STORE_ERROR_QUEUE = 'store_error'

export function storeObject(db, data) {
  if (Array.isArray(data)) {
    const promises = data.map(i => store(db, i))
    return Promise.all(promises)
  } else {
    return store(db, data)
  }
}

function store(db, data) {
  const { request, response } = data

  let promises = []
  promises.push(db.collection('batch_items').remove({ _id: new ObjectID(request._id) }))
  promises.push(parseObject(db, response))

  return Promise.all(promises)
}

function parseObject(db, i) {
  if (i.body && typeof i.body === 'string') {
    i.body = JSON.parse(i.body)
  }

  if (i.code >= 200 && i.code < 300) {
    if (i.body && i.body.category) {
      return updatePage(db, i.body)
    } else {
      return db.collection(STORE_OBJECT_QUEUE).insert(i)
    }
  } else {
    return db.collection(STORE_ERROR_QUEUE).insert(i)
  }
}

function updatePage(db, i) {
  return db.collection('pages').update({ fb_account_id: i.id }, {
    $set: {
      about: i.about,
      category: i.category,
      category_list: i.category_list,
      cover: i.cover,
      emails: i.emails,
      engagement: i.engagement,
      fan_count: i.fan_count,
      is_published: i.is_published,
      is_verified: i.is_verified,
      is_webhooks_subscribed: i.is_webhooks_subscribed,
      link: i.link,
      location: i.location,
      name: i.name,
      overall_star_rating: i.overall_star_rating,
      phone: i.phone,
      rating_count: i.rating_count,
      talking_about_count: i.talking_about_count,
      verification_status: i.verification_status,
      voip_info: i.voip_info,
      were_here_count: i.were_here_count
    }
  })
}
