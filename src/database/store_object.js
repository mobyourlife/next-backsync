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
  promises.push(parseObject(db, request, response))

  return Promise.all(promises)
}

function parseObject(db, req, i) {
  if (i.body && typeof i.body === 'string') {
    i.body = JSON.parse(i.body)
  }

  if (i.code >= 200 && i.code < 300) {
    switch (req.fb_request_type) {
      case 'page':
        return updatePage(db, i.body)
      
      case 'album':
        return insertAlbums(db, req, i.body)
      
      case 'photo':
        return insertPhotos(db, req, i.body)
      
      case 'feed':
        return insertFeed(db, req, i.body)
      
      default:
        return db.collection(STORE_OBJECT_QUEUE).insert(i)
    }
  } else {
    return db.collection(STORE_ERROR_QUEUE).insert(i)
  }
}

function updatePage(db, i) {
  return db.collection('pages').update({
    fb_account_id: i._id
  }, {
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

function insertAlbums(db, req, body) {
  let promises = body.data.map(i => upsertAlbum(db, req.fb_account_id, i))
  return Promise.all(promises)
}

function upsertAlbum(db, fb_account_id, i) {
  return db.collection('albums').update({
    fb_account_id,
    fb_album_id: i.id
  }, {
    fb_account_id,
    fb_album_id: i.id,
    name: i.name
  }, {
    upsert: true
  })
}

function insertPhotos(db, req, body) {
  let promises = body.data.map(i => upsertPhoto(db, req.fb_account_id, req.fb_album_id, i))
  return Promise.all(promises)
}

function upsertPhoto(db, fb_account_id, fb_album_id, i) {
  return db.collection('photos').update({
    fb_account_id,
    fb_album_id,
    fb_photo_id: i.id
  }, {
    fb_account_id,
    fb_album_id,
    fb_photo_id: i.id,
    backdated_time: i.backdated_time,
    created_time: i.created_time,
    height: i.height,
    images: i.images,
    link: i.link,
    name: i.name,
    place: i.place,
    updated_time: i.updated_time,
    width: i.width
  }, {
    upsert: true
  })
}

function insertFeed(db, req, body) {
  let promises = body.data.map(i => upsertFeed(db, req.fb_account_id, i))
  return Promise.all(promises)
}

function upsertFeed(db, fb_account_id, i) {
  return db.collection('feed').update({
    fb_account_id,
    fb_feed_id: i.id
  }, {
    fb_account_id,
    fb_feed_id: i.id,
    caption: i.caption,
    created_time: i.created_time,
    description: i.description,
    from: i.from,
    is_hidden: i.is_hidden,
    is_published: i.is_published,
    link: i.link,
    message: i.message,
    message_tags: i.message_tags,
    name: i.name,
    object_id: i.object_id,
    parent_id: i.parent_id,
    permalink_url: i.permalink_url,
    properties: i.properties,
    source: i.source,
    status_type: i.status_type,
    story: i.story,
    type: i.type,
    updated_time: i.updated_time
  }, {
    upsert: true
  })
}
