import { selector } from './config.mjs'

let root

let init = () => {
  root = document.querySelector(selector)
}

export { init, root }
