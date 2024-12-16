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
router.bind('#root')

// Force the router to use hash (#/foo)
router.hash()

// Defining routes
router.get( // or post() or all()
  '/foo', 
  () => 'foo' // can be async
)

// Defining proxies (middleware)
router.get( // or post() or all()
  '/foo', 
  (request, params, next) => next(request)
)

// Request
router.get('/foo', request => {
  console.log(
    request.method, // 'GET' or 'POST'
    request.url,    // URL
    request.params, // {}
    request.query,  // URLSearchParams
  )
})
router.post('/foo', request => {
  console.log(request.body) // FormData
})

// Params
router.get('/:foo', request => request.params.foo)
router.get('/*foo', request => request.params.foo)

// Custom 404 & 500
router.get('/404', () => 'Not found')
router.get('/500', request => request.error)

// Redirection
router.get('/foo', () => router.redirect('/bar'))

// Navigation
// Triggers events
router.push('/foo')
router.replace('/foo')
router.reload()

// Client side fetch
// Does not trigger events
router.get('/', () => 'Hello world!')
router.fetch('/').then(res => {
  console.log(res.body) // Hello world!
})

// Events
var unsubscribe = router.subscribe(function (event) {
  console.log(event.type) // 'loading' or 'loaded'
})
```

## Loading Indicator

```html
<style>
  .loading .indicator {
    display: block;
  }
  .indicator {
    display: none;
  }
</style>
<div id="indicator">Loading...</div>
<div id="root"></div>
<script>
  router.bind('#root')
</script>
```