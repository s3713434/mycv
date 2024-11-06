/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is used
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in used');
    }
    // Hash the users password

    // Create a new user and save it

    // return the user
  }

  signin() {}
}
