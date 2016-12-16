import fetch from 'node-fetch'
import FormData from 'form-data'

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET

export function batchRequest(batch_items) {
  return new Promise((resolve, reject) => {
    const data = batch_items.map(mapBatchItems)

    getAccessToken().then(token => {
      let form = new FormData()
      form.append('access_token', token)
      form.append('batch', JSON.stringify(data))

      return fetch('https://graph.facebook.com/v2.8?locale=pt_BR', {
        method: 'POST',
        body: form
      })
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

function getAccessToken() {
  const args = objectToQueryString({
    client_id: FACEBOOK_APP_ID,
    client_secret: FACEBOOK_APP_SECRET,
    grant_type: 'client_credentials'
  })

  return fetch(`https://graph.facebook.com/v2.8/oauth/access_token?${args}`)
    .then(res => res.json())
    .then(json => json.access_token)
    .then(token => {
      if (token) {
        return token
      } else {
        throw new Error('Unable to get access token from Facebook API!')
      }
    })
}

function objectToQueryString(obj) {
  let ret = ''

  Object.keys(obj).forEach(i => {
    if (ret.length > 0) {
      ret += '&'
    }

    ret += i + '=' + obj[i]
  })

  return ret
}

function mapBatchItems(i) {
  return {
    method: i.method,
    relative_url: i.relative_url
  }
}
