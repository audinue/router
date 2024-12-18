import { proxies, routes } from './routes.mjs'
import { find } from './util.mjs'

let match = async (request) => {
  let proxy = fetch => {
    return proxies.reduce((next, proxy) => {
      let params = proxy.match(request)
      if (params) {
        return request => {
          return proxy.fetch(request, params, next)
        }
      } else {
        return next
      }
    }, fetch)
  }
  try {
    for (let route of routes) {
      let params = route.match(request)
      if (params) {
        return await proxy(route.fetch)({ ...request, params })
      }
    }
    return await proxy(find('/404'))(request)
  } catch (error) {
    return await proxy(find('/500'))({ ...request, error })
  }
}

export { match }

