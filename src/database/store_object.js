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

function store(db, i) {
  const col = i.code >= 200 && i.code < 300 ? STORE_OBJECT_QUEUE : STORE_ERROR_QUEUE
  if (i.body && typeof i.body === 'string') {
    i.body = JSON.parse(i.body)
  }
  return db.collection(col).insert(i)
}
