import fetch from 'node-fetch'
import FormData from 'form-data'

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN

export function fetchBatchRequests(batch_items) {
  return new Promise((resolve, reject) => {
    const data = batch_items.map(i => {
      return {
        method: i.method,
        relative_url: i.relative_url
      }
    })

    const form = new FormData()
    form.append('access_token', FACEBOOK_ACCESS_TOKEN)
    form.append('batch', JSON.stringify(data))

    fetch('https://graph.facebook.com', {
      method: 'POST',
      body: form
    })
    .then(res => res.json())
    .then(res => {
      for (let i = 0; i < batch_items.length; i++) {
        console.log('_id:', batch_items[i]._id)
        console.log('res:', res[i])
        console.log('---')
      }
      resolve(null)
    }, err => {
      reject('Failed to execute Facebook Batch Request!')
    })
  })
}
