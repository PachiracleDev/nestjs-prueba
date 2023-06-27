import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column()
  password: string;

  @Column({
    default: 'user',
  })
  role: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  readonly createAt: Date;
}
