export class ApiResponse {
  constructor(statusCode, data, message = "Successfull") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  // "এই send() method-টা একটা response object বানিয়ে রাখার পরে, সেটাকে
  // actual HTTP response হিসেবে client-এর কাছে পাঠানোর কাজ করে। মানে
  //  new ApiResponse(200, userData, "User found") দিয়ে data structure
  // বানানো হলো, আর .send(res) কল করলে সেটাই status code আর JSON
  // body সহ response হয়ে user-এর কাছে চলে যায়।"
  send(res) {
    return res.status(this.statusCode).json(this);
  }
}
