import { HTTP_STATUS } from "../../../shared/constant.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwt.js";
import { UserRepository } from "../repositories/auth.repositories.js";
import { ApiError } from "./../../../utils/ApiError.js";
import bcrypt from "bcrypt";

export class AuthService {
  #userRepository;
  constructor(userRepo = new UserRepository()) {
    this.#userRepository = userRepo;
  }

  // register user
  async register({ name, email, password }) {
    const existingUser = await this.#userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "User already exist with this email",
      );
    }

    //creating user
    const user = await this.#userRepository.createUser({
      name,
      email,
      password,
    });

    //generating tokens
    const tokens = await this.#generateTokenPair(user._id);
    return {
      user,
      ...tokens,
    };
  }

  //access and refresh token
  async #generateTokenPair(userId) {
    if (!userId) {
      throw new ApiError("User id is required for generating tokens");
    }
    const accessToken = await generateAccessToken(userId);
    const refreshToken = await generateRefreshToken(userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  //login user
  async login({ email, password }) {
    const user = await this.#userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User is not exist");
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Wrong email or password");
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    const tokens = await this.#generateTokenPair(user._id);
    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }
}
