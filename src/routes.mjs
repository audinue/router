import { wrap } from './response.mjs'

let proxies = []
let routes = []

let defaults = [
  {
    path: '/404',
    fetch: request => {
      return wrap(
        request,
        `<pre>Unable to ${request.method} ${request.url.pathname}</pre>`
      )
    }
  },
  {
    path: '/500',
    fetch: request => {
      console.error(request.error)
      return wrap(request, `<pre>${request.error.stack}</pre>`)
    }
  }
]

let add = methods => {
  return (path, callback) => {
    let regExp = new RegExp(
      '^' +
        path
          .replace(/[/.-]/g, '\\$&')
          .replace(/\:([^\\]+)/g, '(?<$1>[/.-]+)')
          .replace(/\*(.+)/g, '(?<$1>.*)') +
        '$'
    )
    let route = {
      path: path,
      match: request => {
        if (methods.includes(request.method)) {
          let match = regExp.exec(request.url.pathname)
          if (match) {
            return match.groups ?? {}
          }
        }
      },
      fetch: async (request, params, next) => {
        return wrap(
          request,
          await Promise.resolve(callback(request, params, next))
        )
      }
    }
    if (callback.length === 3) {
      proxies.push(route)
    } else {
      routes.push(route)
    }
  }
}

let get = add(['GET'])
let post = add(['POST'])
let all = add(['GET', 'POST'])

export { all, defaults, get, post, proxies, routes }
