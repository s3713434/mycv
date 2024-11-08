import {
  Body,
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

// The errors here are mostly for the basic check on the request
@Controller('users')
@Serialize<UserDto>(UserDto)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }

  @Get('/whoami')
  // Otherwise use whoAmI(@Request() request:Request)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const user = await this.usersService.findOne(id);
    // This will return to the user.
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/me')
  removeUser(@CurrentUser() user: User) {
    return this.usersService.remove(user.id);
  }

  @Patch('/me')
  updateUser(@CurrentUser() user: User, @Body() body: UpdateUserDto) {
    return this.usersService.update(user.id, body);
  }
}
