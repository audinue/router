import { route } from '../router'

route({
  routes: [
    {
      path: '/',
      async fetch () {
        return `Hello world!`
      }
    }
  ],
})
