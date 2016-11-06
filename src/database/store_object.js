export function storeObject(db, data) {
  if (Array.isArray(data)) {
    const promises = data.map(i => store(db, i))
    return Promise.all(promises)
  } else {
    return store(data)
  }
}

function store(db, i) {
  i.body = JSON.parse(i.body)
  return db.collection('objects').insert(i)
}
