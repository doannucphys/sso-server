import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  //   canActivate(
  //     context: ExecutionContext,
  //   ): boolean | Promise<boolean> | Observable<boolean> {
  //     // const request = context.switchToHttp().getRequest();
  //     const res = context.switchToHttp().getResponse();
  //     return res.redirect('http://localhost:5173/404');
  //     // return false;
  //     // validateRequest(request);
  //   }
}
