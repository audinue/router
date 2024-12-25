import { serve } from '@audinue/server'

export type GetRequest = {
  method: 'GET'
  url: URL
  params: Record<string, string>
}

export type PostRequest = {
  method: 'POST'
  url: URL
  params: Record<string, string>
  body: FormData
}

export type AllRequest = {
  method: 'GET' | 'POST'
  url: URL
  params: Record<string, string>
  body?: FormData
}

export type ErrorRequest = AllRequest & { error: Error }

export type Response =
  | string
  | { location: string }
  | Promise<string>
  | Promise<{ location: string }>

export const route: (options: {
  routes: (
    | {
        method: 'GET'
        path: string
        fetch(request: GetRequest): Response
      }
    | {
        method: 'POST'
        path: string
        fetch(request: PostRequest): Response
      }
    | {
        method?: 'ALL'
        path: string
        fetch(request: AllRequest): Response
      }
  )[]
  middleware?(request: AllRequest): Response
  notFound?(request: AllRequest): Response
  error?(request: ErrorRequest): Response
}) => ReturnType<typeof serve>
