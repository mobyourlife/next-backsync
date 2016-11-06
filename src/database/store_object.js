export function storeObject(db, data) {
  if (Array.isArray(data)) {
    const promises = data.map(i => store(db, i))
    return Promise.all(promises)
  } else {
    return store(data)
  }
}

function store(db, i) {
  const col = i.code >= 200 && i.code < 300 ? 'objects' : 'errors'
  i.body = JSON.parse(i.body)
  return db.collection(col).insert(i)
}
