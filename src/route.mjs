import { caching } from './config.mjs'
import { notify } from './event.mjs'
import { fetch } from './fetch.mjs'
import { create } from './request.mjs'
import { root } from './root.mjs'
import { safe } from './util.mjs'

let loading = null

let abort = () => {
  if (loading !== null) {
    loading = null
    root.classList.remove('loading')
    notify({ type: 'loaded' })
  }
}

let caches

let equals = (a, b) => {
  return a && a.method === b.method && a.url === b.url
}

let route = async (url, options) => {
  let request = create(url, options)
  let id = {
    method: request.method,
    url: request.url.toString()
  }
  if (equals(loading, id)) {
    return
  }
  if (!loading) {
    root.classList.add('loading')
    notify({ type: 'loading' })
  }
  loading = id
  if (caching && !caches) {
    caches = JSON.parse(localStorage.getItem('caches') || '{}')
  }
  let cached =
    caching &&
    request.method !== 'POST' &&
    !request.restored &&
    request.url in caches
  if (cached) {
    let { body, url } = caches[request.url]
    root.innerHTML = body
    if (request.state !== 'REPLACE') {
      history.pushState(body, '', url)
    }
  }
  try {
    let response = await fetch(request)
    let body = String(response.body)
    let url = safe(response.url)
    if (equals(loading, id)) {
      root.innerHTML = body
      if (response.url.toString() !== request.url.toString()) {
        if (response.state === 'REPLACE' || cached) {
          history.replaceState(null, '', safe(request.url))
          history.replaceState(body, '', url)
        } else {
          history.pushState(null, '', safe(request.url))
          history.replaceState(body, '', url)
        }
      } else {
        if (response.state === 'REPLACE' || cached) {
          history.replaceState(body, '', url)
        } else {
          history.pushState(body, '', url)
        }
      }
      let element = root.querySelector('[autofocus]')
      if (element) {
        element.focus()
      }
    }
    if (caching && request.method !== 'POST') {
      caches[request.url] = { body, url }
      localStorage.setItem('caches', JSON.stringify(caches))
    }
  } finally {
    if (equals(loading, id)) {
      loading = null
      root.classList.remove('loading')
      notify({ type: 'loaded' })
    }
  }
}

let push = route

let replace = (url, options) => {
  route(url, { state: 'REPLACE', ...options })
}

let reload = options => {
  replace('', options)
}

export { abort, push, reload, replace, route }
