export const throttle = (fn: (e: Event) => void, wait: number): (e: Event) => void => {
  let time = Date.now()
  return (e: Event) => {
    if (time + wait - Date.now() < 0) {
      fn(e)
      time = Date.now()
    }
  }
}
