import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/whoami')
  whoAmI(@CurrentUser() user: string) {
    return user;
  }

  @Get('/colors/:color')
  setSessionColors(@Param('color') color: string, @Session() session: any) {
    session.color = undefined;
    session.name = undefined;
  }

  @Get('/colors')
  getSessionColors(@Session() session: any) {
    console.log('session', session);
    return session.color;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin({
      email: body.email,
      password: body.password,
    });
    session.userId = user.id;
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup({
      email: body.email,
      password: body.password,
    });
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    console.log('handler running');
    return this.userService.findOne({ id: id });
  }

  @Get('/')
  findAllUsers(@Query('email') email: string) {
    return this.userService.find({ email });
  }

  @Delete('/:id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove({ id });
  }

  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.update({
      id,
      email: body.email,
      password: body.password,
    });
  }
}
