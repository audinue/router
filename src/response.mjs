let tag = {}

let redirect = location => {
  return { tag, location: location }
}

let wrap = (request, response) => {
  if (response && response.tag === tag) {
    return response
  } else {
    return {
      tag,
      body: response,
      url: request.url
    }
  }
}

export { redirect, wrap }
