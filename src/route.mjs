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

let route = async (url, options) => {
  if (caching && !caches) {
    caches = JSON.parse(localStorage.getItem('caches') || '{}')
  }
  let id = {}
  if (!loading) {
    root.classList.add('loading')
    notify({ type: 'loading' })
  }
  loading = id
  let request = create(url, options)
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
    if (loading === id) {
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
    if (loading === id) {
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
