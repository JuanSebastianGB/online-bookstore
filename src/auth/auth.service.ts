import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user.password === password) {
      const { password, ...rest } = user;
      return user;
    }
    return null;
  }
}
