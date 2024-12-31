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
