export function consumeQueue(ch, queue_name, promise) {
  ch.consume(queue_name, msg => {
    try {
      const data = JSON.parse(msg.content.toString())
      promise(data).then(() => {
        ch.ack(msg)
      }, err => {
        console.error(`Failed to consume message from queue ${queue_name}!`)
      })
    } catch (err) {
        console.error(`Fatal error trying consume message from queue ${queue_name}!`)
    }
  })
}
