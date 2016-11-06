import { Observable } from 'rxjs/Observable'

export function consumeQueue(ch, queue_name, promise) {
  ch.assertQueue(queue_name, {durable: true})

  return Observable.create(observer => {
    ch.consume(queue_name, msg => {
      try {
        const data = JSON.parse(msg.content.toString())
        console.log('Consuming', data.length, ' items from the queue')
        observer.next(data)
        ch.ack(msg)
      } catch (err) {
        console.error(`Fatal error trying consume message from queue ${queue_name}!`)
      }
    })
  })
}
