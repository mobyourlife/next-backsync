export function loop(promise, interval) {
  const repeat = () => {
    return promise().then(() => {
      setTimeout(repeat, interval * 1000)
    }, (err) => {
      console.error(err)
    })
  }
  repeat()
}
