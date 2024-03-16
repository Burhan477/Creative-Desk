export interface objResponseType {
  success: boolean
  message: string
  data: datatype | datatype[] | any
}

export interface datatype {
  title: string
  message: string
}
