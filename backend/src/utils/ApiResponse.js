export class ApiResponse {
  constructor(statuscode, data, message = "Success") {
    this.success = statuscode < 400;
    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
  }
  send(res) {
    return res.status(this.statuscode).json(this);
  }
}
