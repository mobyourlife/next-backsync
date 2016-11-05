import fetch from 'node-fetch'
import FormData from 'form-data'

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN

export function batchRequest(batch_items) {
  return new Promise((resolve, reject) => {
    const data = batch_items.map(mapBatchItems)

    const form = new FormData()
    form = addAccesstoken(form)
    form.append('batch', JSON.stringify(data))

    fetch('https://graph.facebook.com', {
      method: 'POST',
      body: form
    })
    .then(res => res.json())
    .then(resolve, reject)
  })
}

function mapBatchItems(i) {
  return {
    method: i.method,
    relative_url: i.relative_url
  }
}

function addAccesstoken(form) {
  if (FACEBOOK_ACCESS_TOKEN) {
    form.append('access_token', FACEBOOK_ACCESS_TOKEN)
  } else {
    form.append('key', FACEBOOK_APP_ID)
    form.append('access_token', FACEBOOK_APP_SECRET)
  }

  return form
}
