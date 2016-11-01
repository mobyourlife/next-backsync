import {
  connectToFacebookDatabase,
  facebookCheckPages,
  loop
} from './lib'

function main() {
  Promise.all([
    connectToFacebookDatabase()
  ]).then(data => {
    let [db] = data
    
    loop(() => facebookCheckPages(db), 5000)
  })
}

main()
