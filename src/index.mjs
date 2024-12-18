import { domContentLoaded } from './handler.mjs'

addEventListener('DOMContentLoaded', domContentLoaded)

export { bind, cache, hash, update } from './config.mjs'
export { subscribe } from './event.mjs'
export { fetch } from './fetch.mjs'
export { redirect } from './response.mjs'
export { push, reload, replace } from './route.mjs'
export { all, get, post } from './routes.mjs'
