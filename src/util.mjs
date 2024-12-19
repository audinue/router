import { hashing } from './config.mjs'
import { root } from './root.mjs'
import { defaults, routes } from './routes.mjs'

let acceptable = url => {
  return url.origin === location.origin
}

let self = element => {
  return element.target === '' || element.target === '_self'
}

let safe = url => {
  return hashing ? '#' + url.pathname + url.search : url
}

let find = path => {
  return [...routes, ...defaults].find(route => {
    return route.path === path
  }).fetch
}

let state = element => (element.hasAttribute('replace') ? 'REPLACE' : 'PUSH')

let equals = (a, b) => {
  return a && a.method === b.method && a.url === b.url
}

let render = (html, request) => {
  root.innerHTML = html
  if (!request.restored) {
    document.body.scrollTo(0, 0)
  }
  let element = root.querySelector('[autofocus]')
  if (element) {
    element.focus()
  }
}

export { acceptable, equals, find, render, safe, self, state }
