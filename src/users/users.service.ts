import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    newUser.password = bcrypt.hashSync(newUser.password, 10);

    const user = await this.userRepository.save(newUser).catch((err) => {
      if (err.code === '23505') {
        throw new BadRequestException('Email ya registrado');
      }
    });

    if (!user) {
      throw new BadRequestException('Hubo un error al crear el usuario');
    }

    const payload = {
      role: 'user',
      sub: newUser.id,
    };

    return payload;
  }

  async findByUserId(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new ForbiddenException('Usuario no encontrado');
    return user;
  }

  async logout(userId: number) {
    await this.userRepository
      .update(
        {
          id: userId,
        },
        {
          refreshToken: null,
        },
      )
      .catch((error) => {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
          throw new ForbiddenException('Usuario no encontrado');
        } else {
          throw new ForbiddenException('Acceso Denegado');
        }
      });
    return {
      message: 'Se cerró sesión con éxito',
    };
  }

  async updateRt(userId: number, rt: string): Promise<void> {
    const hash = await bcrypt.hash(rt, 10);

    await this.userRepository.update(
      {
        id: userId,
      },
      {
        refreshToken: hash,
      },
    );
  }

  async removeRefreshToken(userId: number) {
    await this.userRepository.update(
      {
        id: userId,
      },
      {
        refreshToken: null,
      },
    );
    return true;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) null;
    return user;
  }
}
