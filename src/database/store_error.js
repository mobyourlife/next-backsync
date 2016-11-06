export function storeError(db, data) {
  if (Array.isArray(data)) {
    const promises = data.map(i => store(db, i))
    return Promise.all(promises)
  } else {
    return store(db, data)
  }
}

function store(db, i) {
  if (i.body && typeof i.body === 'string') {
    i.body = JSON.parse(i.body)
  }
  return db.collection('errors').insert(i)
}
