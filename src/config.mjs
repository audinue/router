let hashing = location.origin === 'file://'
let selector = 'body'
let updating = false
let caching = false

let hash = () => {
  hashing = true
}

let bind = root => {
  selector = root
}

let update = () => {
  updating = true
}

let cache = () => {
  caching = true
}

export { bind, cache, caching, hash, hashing, selector, update, updating }

