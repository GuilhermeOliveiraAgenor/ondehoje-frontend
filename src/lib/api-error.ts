export class ApiError extends Error {
  public statusCode?: number
  public errors?: Record<string, string[]>

  constructor(message: string, statusCode?: number, errors?: any) {
    super(message) // Passa a mensagem para a classe pai Error
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors
  }
}
