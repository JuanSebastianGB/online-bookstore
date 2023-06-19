import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * This is an async function that validates a user's email and password, and returns an access token if
   * the validation is successful.
   * @param {string} email - A string representing the email address of the user being validated.
   * @param {string} password - The password parameter is a string representing the password entered by
   * the user trying to log in.
   * @returns The function `validateUser` returns an object with an `accessToken` property if the user's
   * email and password match, and `null` otherwise.
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;
    const isMatch = await comparePassword(password, user.password);
    if (isMatch) {
      const { password, ...rest } = user;
      const payload = {
        sub: rest.id,
        role: rest.role,
      };
      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    }
    return null;
  }
}
