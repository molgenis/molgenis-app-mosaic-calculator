export type TableType = 'events' | 'array'

export interface TableCreate {
  tableName: string,
  type: TableType,
  callback: Function
}

export interface PostArguments {
  lines: Array<Object>
  table: string,
  callback: Function
}

export interface AppState {
  events: File | null,
  array: File | null
}
