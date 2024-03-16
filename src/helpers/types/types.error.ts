interface objResponseType {
  success: boolean
  error: arrMessage
}
interface arrMessage {
  title: string
  message: string
}

export { objResponseType, arrMessage }
