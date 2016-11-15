import fetch from 'node-fetch'
import FormData from 'form-data'

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN

export function batchRequest(batch_items) {
  return new Promise((resolve, reject) => {
    const data = batch_items.map(mapBatchItems)

    let form = new FormData()

    if (FACEBOOK_ACCESS_TOKEN) {
      form.append('access_token', FACEBOOK_ACCESS_TOKEN)
    } else if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
      form.append('key', FACEBOOK_APP_ID)
      form.append('access_token', FACEBOOK_APP_SECRET)
    } else {
      reject('Access token not specified!')
      return
    }
    
    form.append('batch', JSON.stringify(data))

    fetch('https://graph.facebook.com/v2.8?locale=pt_BR', {
      method: 'POST',
      body: form
    })
    .then(res => res.json())
    .then(json => {
      if (Array.isArray(json)) {
        let res = []
        for (let i = 0; i < json.length; i++) {
          res.push({
            request: batch_items[i],
            response: json[i]
          })
        }
        resolve(res)
      } else {
        reject(json)
      }
    }, err => {
      reject(err)
    })
  })
}

function mapBatchItems(i) {
  return {
    method: i.method,
    relative_url: i.relative_url
  }
}
