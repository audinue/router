let subscribers = []

let subscribe = subscriber => {
  subscribers.push(subscriber)
  return () => {
    let index = subscribers.indexOf(subscriber)
    if (index > -1) {
      subscribers.splice(index, 1)
    }
  }
}

let notify = event => {
  for (let i = subscribers.length - 1; i > -1; i--) {
    subscribers[i](event)
  }
}

export { notify, subscribe }
