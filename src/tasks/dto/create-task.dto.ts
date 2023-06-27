import { IsString, IsNotEmpty, MaxLength, IsEnum } from 'class-validator';
import { StatusEnum } from '../models/status-enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  description: string;

  @ApiProperty({ enum: StatusEnum })
  @IsNotEmpty()
  @IsEnum(['to do', 'in progress', 'done'])
  status: StatusEnum;
}
