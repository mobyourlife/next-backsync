const amqp = require('amqplib/callback_api')

const url = process.env.MOB_RABBITMQ_URL || 'amqp://localhost'

export function connectToMessageQueue() {
  return new Promise((resolve, reject) => {
    amqp.connect(url, (err, conn) => {
      if (err) {
        reject('Unable to connect to the message queue server!' + err)
      } else {
        conn.createChannel((err, ch) => {
          if (err) {
            reject('Unable to create channel with message queue!' + err)
          } else {
            resolve(ch)
          }
        })
      }
    })
  })
}

export function produceQueue(ch, queue_name, data) {
  return new Promise((resolve, reject) => {
    const msg = JSON.stringify(data)
    ch.assertQueue(queue_name, {durable: true})
    ch.sendToQueue(queue_name, new Buffer(msg), {persistent: true})
    resolve(null)
  })
}

export function consumeQueue(ch, queue_name, promise) {
  ch.consume(queue_name, msg => {
    try {
      const data = JSON.parse(msg.content.toString())
      promise(data).then(() => {
        ch.ack(msg)
      }, err => {
        console.error(`Failed to consume message from queue ${queue_name}! ${data}`)
      })
    } catch (err) {
        console.error(`Fatal error trying consume message from queue ${queue_name}! ${data}`)
    }
  })
}
