export function loop(promise, interval) {
  const repeat = () => {
    return promise().then(() => {
      setTimeout(repeat, interval)
    })
  }
  repeat()
}
