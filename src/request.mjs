import { make } from './url.mjs'

let tag = {}

let create = (url, options) => {
  if (url && url.tag === tag) {
    return url
  } else {
    url = make(url)
    return {
      tag,
      method: 'GET',
      url: url,
      params: {},
      query: url.searchParams,
      ...options
    }
  }
}

export { create }
