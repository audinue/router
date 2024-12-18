import { hashing } from './config.mjs'

let make = url => {
  return new URL(
    url,
    hashing
      ? new URL(location.hash.substring(1), location.origin)
      : new URL(location.href)
  )
}

export { make }
