# router

Client side routing framework.

## Install

```html
<script src="https://cdn.jsdelivr.net/gh/audinue/router/router.js"></script>
```

## Usage

```javascript
// Write response body to <div id="root">
// instead of <body>
bind('#root')

// Enable caching
cache()

// Update on popstate
update()

// Force the router to use hash (#/foo)
hash()

// Defining routes
get( // or post() or all()
  '/foo', 
  () => 'foo' // can be async
)

// Defining proxies (middleware)
get( // or post() or all()
  '/foo', 
  (request, params, next) => next(request)
)

// Request
get('/foo', request => {
  console.log(
    request.method, // 'GET' or 'POST'
    request.url,    // URL
    request.params, // {}
    request.query,  // URLSearchParams
  )
})
post('/foo', request => {
  console.log(request.body) // FormData
})

// Params
get('/:foo', request => request.params.foo)
get('/*foo', request => request.params.foo)

// Custom 404 & 500
get('/404', () => 'Not found')
get('/500', request => request.error)

// Redirection
get('/foo', () => redirect('/bar'))

// Navigation
// Triggers events
push('/foo')
replace('/foo')
reload()

// Client side fetch
// Does not trigger events
get('/', () => 'Hello world!')
fetch('/').then(res => {
  console.log(res.body) // Hello world!
})

// Events
let unsubscribe = subscribe(function (event) {
  console.log(event.type) // 'loading' or 'loaded'
})
```

## Loading Indicator

```html
<style>
  .indicator {
    display: none;
  }
  .loading ~ .indicator {
    display: block;
  }
</style>
<div id="root"></div>
<div id="indicator">Loading...</div>
<script>
  import { bind } from 'https://esm.sh/@audinue/router'

  bind('#root')

  get('/', async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return 'Hello world!'
  })
</script>
```