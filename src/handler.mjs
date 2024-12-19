import { hashing, updating } from './config.mjs'
import { init, root } from './root.mjs'
import { abort, reload, route } from './route.mjs'
import { make } from './url.mjs'
import { acceptable, self, state } from './util.mjs'

let popstate = event => {
  if (event.state !== null) {
    root.innerHTML = event.state
    abort()
    if (updating) {
      reload({ restored: true })
    }
  }
}

let hashchange = () => {
  if (hashing && history.state === null) {
    reload()
  }
}

let click = event => {
  if (event.target.nodeName === 'A' && self(event.target)) {
    let href = event.target.getAttribute('href')
    if (href !== null) {
      let url = make(href)
      if (acceptable(url)) {
        event.preventDefault()
        route(url, { state: state(event.target) })
      }
    }
  }
}

let submit = event => {
  if (self(event.target)) {
    let url = make(event.target.getAttribute('action') || '')
    if (acceptable(url)) {
      event.preventDefault()
      let body = new FormData(event.target, event.submitter)
      if (event.target.method === 'get') {
        for (let [name, value] of body) {
          url.searchParams.set(name, value)
        }
        route(url, { state: state(event.target) })
      } else {
        route(url, {
          state: state(event.target),
          method: 'POST',
          body
        })
      }
    }
  }
}

let domContentLoaded = () => {
  init()
  if (updating && history.state !== null) {
    root.innerHTML = history.state
    reload({ restored: true })
  } else {
    reload()
  }
  addEventListener('popstate', popstate)
  addEventListener('hashchange', hashchange)
  addEventListener('click', click)
  addEventListener('submit', submit)
}

export { domContentLoaded }
