import { updating } from './config.mjs'
import { init, root } from './root.mjs'
import { abort, reload, route } from './route.mjs'
import { make } from './url.mjs'
import { acceptable, self } from './util.mjs'

addEventListener('DOMContentLoaded', () => {
  init()
  reload()
})

addEventListener('popstate', event => {
  if (event.state !== null) {
    root.innerHTML = event.state
    abort()
    if (updating) {
      reload({ restored: true })
    }
  }
})

addEventListener('hashchange', () => {
  if (hashing && history.state === null) {
    reload()
  }
})

addEventListener('click', event => {
  if (event.target.nodeName === 'A' && self(event.target)) {
    let href = event.target.getAttribute('href')
    if (href !== null) {
      let url = make(href)
      if (acceptable(url)) {
        event.preventDefault()
        route(url)
      }
    }
  }
})

addEventListener('submit', event => {
  if (self(event.target)) {
    let url = make(event.target.getAttribute('action') || '')
    if (acceptable(url)) {
      event.preventDefault()
      let body = new FormData(event.target, event.submitter)
      if (event.target.method === 'get') {
        for (let [name, value] of body) {
          url.searchParams.set(name, value)
        }
        route(url)
      } else {
        route(url, { method: 'POST', body })
      }
    }
  }
})

export { bind, hash, update, cache } from './config.mjs'
export { subscribe } from './event.mjs'
export { fetch } from './fetch.mjs'
export { redirect } from './response.mjs'
export { push, reload, replace } from './route.mjs'
export { all, get, post } from './routes.mjs'
