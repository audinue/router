import { serve } from "@audinue/server";

let route = ({
  routes,
  middleware = async (request, next) => next(request),
  notFound = async (request) =>
    `<pre>Unable to ${request.method} ${request.url.pathname}</pre>`,
  error = async (request) => `<pre>${request.error.stack}</pre>`,
  ...more
}) => {
  routes = routes.map(({ method, path, fetch }) => {
    let matchMethod =
      method === "GET"
        ? (request) => request.method === "GET"
        : method === "POST"
        ? (request) => request.method === "POST"
        : () => true;
    let regExp = new RegExp(
      "^" +
        path
          .replace(/[/.-]/g, "\\$&")
          .replace(/\:([^\\]+)/g, "(?<$1>[^/]+)")
          .replace(/\*(.+)/g, "(?<$1>.*)") +
        "$"
    );
    return {
      match(request) {
        if (!matchMethod(request)) {
          return;
        }
        let match = regExp.exec(request.url.pathname);
        if (match) {
          return match.groups ?? {};
        }
      },
      fetch,
    };
  });
  return serve({
    async fetch(request) {
      try {
        for (let route of routes) {
          let params = route.match(request);
          if (!params) {
            continue;
          }
          return await middleware({ ...request, params }, route.fetch);
        }
        return await notFound(request);
      } catch (e) {
        return await error({ ...request, error: e });
      }
    },
    ...more,
  });
};

export let Router = () => {
  let routes = [];
  let routeConfig = { routes };
  return {
    get(path, fetch) {
      routes.push({ method: "GET", path, fetch });
      return this;
    },
    post(path, fetch) {
      routes.push({ method: "POST", path, fetch });
      return this;
    },
    all(path, fetch) {
      routes.push({ path, fetch });
      return this;
    },
    middleware(fetch) {
      routeConfig.middleware = fetch;
      return this;
    },
    notFound(fetch) {
      routeConfig.notFound = fetch;
      return this;
    },
    error(fetch) {
      routeConfig.error = fetch;
      return this;
    },
    start(serveConfig = {}) {
      return route({ ...routeConfig, ...serveConfig });
    },
  };
};

export { route };
export { redirect } from "@audinue/server";
