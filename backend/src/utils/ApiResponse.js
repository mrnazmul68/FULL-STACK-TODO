export class ApiResponse {
  constructor(statusCode, data, message = "Successfull") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
  send(res) {
    return res.status(this.statusCode).json(this);
  }
}
