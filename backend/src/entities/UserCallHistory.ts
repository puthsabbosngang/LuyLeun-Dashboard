import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'user_call_history' })
export class UserCallHistory {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    date!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    duration!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    number!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    type!: string;

  @Column({ type: 'int', nullable: true })
    user_id!: number;

  @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}
