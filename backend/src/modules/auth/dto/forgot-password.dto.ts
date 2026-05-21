import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for forgot password
 */
export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address to send reset link',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
