var router = (function () {
  var hashing = location.origin === 'file://'

  var hash = function () {
    hashing = true
    return this
  }

  var tag = {}

  var redirect = function (location) {
    return { tag: tag, location: location }
  }

  var current = function () {
    if (hashing) {
      return new URL(location.hash.substring(1), location.origin)
    } else {
      return new URL(location.href)
    }
  }

  var wrap = function (request, response) {
    if (response !== null && response !== undefined && response.tag === tag) {
      return response
    }
    return {
      tag: tag,
      body: response,
      url: request.url,
      state: request.state
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

  var path = function (value) {
    return function (route) {
      return route.path === value
    }
  }

  var fetch = function (url, options) {
    var request = Object.assign(
      { method: 'GET', url: new URL(url, current()) },
      options
    )
    var proxy = function (end) {
      var proxied = end
      for (var i = 0; i < proxies.length; i++) {
        var proxy = proxies[i]
        var params = proxy.match(request)
        if (params) {
          proxied = (function (fetch, params, next) {
            return function call (request) {
              return fetch(request, params, next)
            }
          })(proxy.fetch, params, proxied)
        }
      }
      return proxied
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

  var root = 'body'

  var bind = function (selector) {
    root = selector
    return this
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
    return hashing ? '#' + url.pathname : url
  }

  var controller = null
  var cache = JSON.parse(localStorage.getItem('cache') || '{}')

  var route = function (url, options) {
    var loader = { aborted: false }
    if (controller) {
      controller.aborted = true
    } else {
      root.classList.add('loading')
      notify({ type: 'loading' })
    }
    controller = loader
    var pushed = false
    if (!options || options.method !== 'POST' || !options.popstate) {
      var key = new URL(url, current())
      if (key in cache) {
        var body = cache[key]
        root.innerHTML = body
        if (!options || options.state !== 'REPLACE') {
          history.pushState(body, '', safe(key))
          pushed = true
        }
      }
    }
    fetch(url, options)
      .then(function (response) {
        var body = response.body
        cache[response.url] = body
        localStorage.setItem('cache', JSON.stringify(cache))
        if (controller === loader) {
          var url = safe(response.url)
          root.innerHTML = body
          if (response.state === 'REPLACE') {
            history.replaceState(body, '', url)
          } else if (!pushed) {
            history.pushState(body, '', url)
          }
          var element = root.querySelector('[autofocus]')
          if (element) {
            element.focus()
          }
        }
      })
      .finally(function () {
        if (controller === loader) {
          controller = null
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
    root = document.querySelector(root)
    reload()
  })

  addEventListener('popstate', function (event) {
    if (event.state !== null) {
      root.innerHTML = event.state
      reload({ popstate: true })
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
        var url = new URL(href, current())
        if (acceptable(url)) {
          event.preventDefault()
          route(url)
        }
      }
    }
  })

  addEventListener('submit', function (event) {
    if (self(event.target)) {
      var url = new URL(event.target.getAttribute('action') || '', current())
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
