import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  /**
   * This is an asynchronous function that checks if a token exists in the request header, verifies it
   * using a JWT service, and sets the user payload in the request object if successful, otherwise throws
   * an UnauthorizedException.
   * @param {ExecutionContext} context - The `context` parameter is an instance of `ExecutionContext`
   * which provides access to the current execution context, including the request and response objects.
   * In this case, it is used to extract the request object and its headers.
   * @returns A Promise that resolves to a boolean value.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers: any = request.headers;
    const token = this.extractTokenFromHeader(headers);
    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  /**
   * This function extracts a token from the authorization header if it exists and is of type "Bearer".
   * @param {any} headers - The `headers` parameter is an object that contains the HTTP headers of a
   * request. The `extractTokenFromHeader` function takes this parameter as input and extracts the
   * authorization token from the `Authorization` header.
   * @returns a string representing the token extracted from the authorization header, or undefined if
   * the header is not present or the token type is not 'Bearer'.
   */
  private extractTokenFromHeader(headers: any): string | undefined {
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
