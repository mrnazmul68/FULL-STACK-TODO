import { UserRepository } from "../repositories/auth.repositories";

class AuthService {
  #userRepository;
  constructor(userRepo = new UserRepository()) {
    this.#userRepository = userRepo;
  }
  async register ({name, email, password}){
    const existingUser = await this.#userRepository.findByEmail(email)
    
  }
}
