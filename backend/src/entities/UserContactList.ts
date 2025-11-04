import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'user_contact_list' })
export class UserContactList {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    number!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    remark!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    phone!: string;

  @Column({ type: 'int', nullable: true })
    user_id!: number;

  @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}
