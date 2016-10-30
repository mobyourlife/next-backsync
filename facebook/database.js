const mongo = require('mongodb').MongoClient

const url = process.env.MONGO_MOB_FACEBOOK_DATABASE || 'mongodb://localhost:27017/mobyourlife_facebook'

export function connectToFacebookDatabase(cb) {
  mongo.connect(url, (err, db) => {
    if (err) {
      var error = new Error('Unable to connect to the server!')
      error.database_url = url
      error.message = err
      throw error
    } else {
      cb(db, () => db.close())
    }
  })
}
