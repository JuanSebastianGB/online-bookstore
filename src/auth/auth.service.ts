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
