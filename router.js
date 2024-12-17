var router = (function () {
  var hashing = location.origin === 'file://'

  var hash = function () {
    hashing = true
    return this
  }

  var current = function () {
    if (hashing) {
      return new URL(location.hash.substring(1), location.origin)
    } else {
      return new URL(location.href)
    }
  }

  var RESPONSE = {}

  var redirect = function (location) {
    return { tag: RESPONSE, location: location }
  }

  var wrap = function (request, response) {
    if (response && response.tag === RESPONSE) {
      return response
    } else {
      return {
        tag: RESPONSE,
        body: response,
        url: request.url,
        state: request.state
      }
    }
  }

  var proxies = []
  var routes = []

  var add = function (methods) {
    return function (path, callback) {
      var regExp = new RegExp(
        '^' +
          path
            .replace(/[/.-]/g, '\\$&')
            .replace(/\:([^\\]+)/g, '(?<$1>[/.-]+)')
            .replace(/\*(.+)/g, '(?<$1>.*)') +
          '$'
      )
      var route = {
        path: path,
        match: function (request) {
          if (methods.includes(request.method)) {
            var match = regExp.exec(request.url.pathname)
            if (match) {
              return match.groups || {}
            }
          }
        },
        fetch: function (request, params, next) {
          return Promise.resolve(callback(request, params, next)).then(
            function (response) {
              return wrap(request, response)
            }
          )
        }
      }
      if (callback.length === 3) {
        proxies.push(route)
      } else {
        routes.push(route)
      }
      return this
    }
  }

  var get = add(['GET'])
  var post = add(['POST'])
  var all = add(['GET', 'POST'])

  var defaults = [
    {
      path: '/404',
      fetch: function (request) {
        return wrap(
          request,
          '<pre>Unable to ' +
            request.method +
            ' ' +
            request.url.pathname +
            '</pre>'
        )
      }
    },
    {
      path: '/500',
      fetch: function (request) {
        console.error(request.error)
        return wrap(request, '<pre>' + request.error.stack + '</pre>')
      }
    }
  ]

  var make = function (url) {
    return new URL(url, current())
  }

  var REQUEST = {}

  var create = function (url, options) {
    if (url && url.tag === REQUEST) {
      return url
    } else {
      return Object.assign({ method: 'GET', url: make(url) }, options)
    }
  }

  var path = function (value) {
    return function (route) {
      return route.path === value
    }
  }

  var fetch = function (url, options) {
    var request = create(url, options)
    var proxy = function (end) {
      return proxies.reduce(function (next, proxy) {
        var params = proxy.match(request)
        if (params) {
          return function (request) {
            return proxy.fetch(request, params, next)
          }
        } else {
          return next
        }
      }, end)
    }
    var promise = new Promise(function (resolve) {
      request.query = request.url.searchParams
      for (var i = 0; i < routes.length; i++) {
        var route = routes[i]
        var params = route.match(request)
        if (params) {
          resolve(
            proxy(route.fetch)(Object.assign({}, request, { params: params }))
          )
          return
        }
      }
      resolve(proxy(routes.concat(defaults).find(path('/404')).fetch)(request))
    })
    return promise
      .catch(function (error) {
        return proxy(routes.concat(defaults).find(path('/500')).fetch)(
          Object.assign({}, request, { error: error })
        )
      })
      .then(function (response) {
        if (response.location) {
          return fetch(new URL(response.location, request.url), {
            state: request.state
          })
        }
        return response
      })
  }

  var subscribers = []

  var subscribe = function (subscriber) {
    subscribers.push(subscriber)
    return function () {
      var index = subscribers.indexOf(subscriber)
      if (index > -1) {
        subscribers.splice(index, 1)
      }
    }
  }

  var notify = function (event) {
    for (var i = subscribers.length - 1; i > -1; i--) {
      subscribers[i](event)
    }
  }

  var safe = function (url) {
    return hashing ? '#' + url.pathname + url.search : url
  }

  var selector = 'body'

  var bind = function (root) {
    selector = root
    return this
  }

  var root

  var loading = null

  var cache = JSON.parse(localStorage.getItem('cache') || '{}')

  var route = function (url, options) {
    var id = {}
    if (!loading) {
      root.classList.add('loading')
      notify({ type: 'loading' })
    }
    loading = id
    var request = create(url, options)
    var pushed = false
    if (
      request.method !== 'POST' &&
      !request.restored &&
      request.url in cache
    ) {
      var entry = cache[request.url]
      root.innerHTML = entry.body
      if (request.state !== 'REPLACE') {
        history.pushState(entry.body, '', entry.url)
        pushed = true
      }
    }
    fetch(url, options)
      .then(function (response) {
        var body = response.body
        var url = safe(response.url)
        if (request.method !== 'POST') {
          cache[request.url] = { body: body, url: url }
          localStorage.setItem('cache', JSON.stringify(cache))
        }
        if (loading === id) {
          root.innerHTML = body
          if (response.state === 'REPLACE') {
            history.replaceState(body, '', url)
          } else {
            if (pushed) {
              if (entry.url !== url) {
                history.replaceState(body, '', url)
              }
            } else {
              history.pushState(body, '', url)
            }
          }
          var element = root.querySelector('[autofocus]')
          if (element) {
            element.focus()
          }
        }
      })
      .finally(function () {
        if (loading === id) {
          loading = null
          notify({ type: 'loaded' })
          root.classList.remove('loading')
        }
      })
    return this
  }

  var push = function (url, options) {
    route(url, options)
    return this
  }

  var replace = function (url, options) {
    route(url, Object.assign({ state: 'REPLACE' }, options))
    return this
  }

  var reload = function (options) {
    return replace('', options)
  }

  var self = function (element) {
    return element.target === '' || element.target === '_self'
  }

  var acceptable = function (url) {
    return url.origin === location.origin
  }

  addEventListener('DOMContentLoaded', function () {
    root = document.querySelector(selector)
    reload()
  })

  addEventListener('popstate', function (event) {
    if (event.state !== null) {
      root.innerHTML = event.state
      reload({ restored: true })
    }
  })

  addEventListener('hashchange', function () {
    if (hashing && history.state === null) {
      reload()
    }
  })

  addEventListener('click', function (event) {
    if (event.target.nodeName === 'A' && self(event.target)) {
      var href = event.target.getAttribute('href')
      if (href !== null) {
        var url = make(href)
        if (acceptable(url)) {
          event.preventDefault()
          route(url)
        }
      }
    }
  })

  addEventListener('submit', function (event) {
    if (self(event.target)) {
      var url = make(event.target.getAttribute('action') || '')
      if (acceptable(url)) {
        event.preventDefault()
        var body = new FormData(event.target, event.submitter)
        if (event.target.method === 'get') {
          var entries = body.entries()
          while (true) {
            var entry = entries.next()
            if (entry.done) {
              break
            }
            url.searchParams.set(entry.value[0], entry.value[1])
          }
          route(url)
        } else {
          route(url, { method: 'POST', body: body })
        }
      }
    }
  })

  return {
    hash: hash,
    redirect: redirect,
    get: get,
    post: post,
    all: all,
    fetch: fetch,
    bind: bind,
    subscribe: subscribe,
    push: push,
    replace: replace,
    reload: reload
  }
})()
