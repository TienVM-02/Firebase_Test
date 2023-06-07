import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }
  async createNewUser(
    dto: CreateUserDTO,
    image: Express.Multer.File,
  ): Promise<UserEntity> {
    const imageRes = await this.uploadImageToFirebase(image);
    if (dto.firstname.length == 0)
      throw new HttpException(
        'first name can not null',
        HttpStatus.BAD_REQUEST,
      );
    if (dto.lastname.length == 0)
      throw new HttpException('last name can not null', HttpStatus.BAD_REQUEST);
    if (dto.age < 1 || dto.age > 100)
      throw new HttpException('age must from 1 to 100', HttpStatus.BAD_REQUEST);
    const newUser = await this.userRepository.save({
      firstName: dto.firstname,
      lastName: dto.lastname,
      age: dto.age,
      avatar: imageRes,
    });
    return newUser;
  }
}
