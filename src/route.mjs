import { caching } from './config.mjs'
import { notify } from './event.mjs'
import { fetch } from './fetch.mjs'
import { create } from './request.mjs'
import { root } from './root.mjs'
import { equals, render, safe } from './util.mjs'

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
  let requestUrl = safe(request.url)
  let cached =
    caching &&
    request.method !== 'POST' &&
    !request.restored &&
    requestUrl in caches
  if (cached) {
    let entry = caches[requestUrl]
    render(entry.body)
    if (request.state === 'REPLACE') {
      history.replaceState(entry.body, '', entry.url)
    } else {
      history.pushState(entry.body, '', entry.url)
    }
  }
  try {
    let response = await fetch(request)
    let body = String(response.body)
    let url = safe(response.url)
    if (equals(loading, id)) {
      render(body)
      if (cached) {
        history.replaceState(body, '', url)
      } else if (requestUrl !== url) {
        if (request.state === 'REPLACE') {
          history.replaceState(null, '', requestUrl)
          history.replaceState(body, '', url)
        } else {
          history.pushState(null, '', requestUrl)
          history.replaceState(body, '', url)
        }
      } else {
        if (request.state === 'REPLACE') {
          history.replaceState(body, '', url)
        } else {
          history.pushState(body, '', url)
        }
      }
    }
    if (caching && request.method !== 'POST') {
      caches[requestUrl] = { body, url }
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
