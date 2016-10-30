export function loop(promise, interval, args) {
  const repeat = () => {
    return promise(args).then(() => {
      setTimeout(repeat, interval)
    })
  }
  repeat()
}
