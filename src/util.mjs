import { hashing } from './config.mjs'
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

export { acceptable, find, safe, self, state }

