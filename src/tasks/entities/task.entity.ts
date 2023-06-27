import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { StatusEnum } from '../models/status-enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Task {
  @ApiProperty({
    type: 'number',
  })
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ApiProperty({
    type: 'string',
  })
  @Column({ type: 'varchar', length: 100 })
  description: string;

  @ApiProperty({
    type: 'string',
  })
  @Column({ type: 'varchar', length: 20 })
  status: StatusEnum;

  @ApiProperty({
    type: 'number',
  })
  @Column({ name: 'user_id', type: 'int' })
  userId: number;
}
