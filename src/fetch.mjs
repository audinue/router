import { match } from './match.mjs'
import { create } from './request.mjs'

let fetch = async (url, options) => {
  let request = create(url, options)
  let response = await match(request)
  if (response.location) {
    return fetch(new URL(response.location, request.url))
  } else {
    return response
  }
}

export { fetch }
