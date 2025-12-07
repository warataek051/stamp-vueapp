export interface RouteMeta {
  // Add any custom meta properties here
}

export interface RouteRecordRaw {
  path: string
  name?: string
  component?: any
  components?: any
  redirect?: string | { name: string }
  alias?: string | string[]
  children?: RouteRecordRaw[]
  meta?: RouteMeta
  beforeEnter?: (to: any, from: any, next: any) => void
  props?: boolean | Object | ((to: any) => Object)
}