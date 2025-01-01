import { ServeConfig, Server } from "@audinue/server";

export type Request = {
  method: "GET" | "POST";
  url: URL;
  params: Record<string, string>;
  body?: FormData;
  error?: any;
};

export type Response = string | { location: string };

export type Fetch = (request: Request) => Response | Promise<Response>;

export type Route = {
  method?: "GET" | "POST";
  path: string;
  fetch: Fetch;
};

export type RouteConfig = ServeConfig & {
  routes: Route[];
  middleware?: Fetch;
  notFound?: Fetch;
  error?: Fetch;
};

export const route: (config: RouteConfig) => Server;

export type Router = {
  get(path: string, fetch: Fetch): Router;
  post(path: string, fetch: Fetch): Router;
  all(path: string, fetch: Fetch): Router;
  middleware(fetch: Fetch): Router;
  notFound(fetch: Fetch): Router;
  error(fetch: Fetch): Router;
  start(config?: ServeConfig): Server;
};

export const Router: () => Router;

export { redirect } from "@audinue/server";
