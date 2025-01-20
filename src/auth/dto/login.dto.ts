import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    description: 'Email',
  })
  readonly username: string;

  @ApiProperty()
  readonly password: string;
}
