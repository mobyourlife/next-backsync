export function produceQueue(ch, queue_name, data) {
  return new Promise((resolve, reject) => {
    const msg = JSON.stringify(data)
    ch.assertQueue(queue_name, {durable: true})
    ch.sendToQueue(queue_name, new Buffer(msg), {persistent: true})
    resolve(null)
  })
}
