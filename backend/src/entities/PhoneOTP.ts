import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'phone_otp' })
export class PhoneOTP {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'bit', nullable: true })
    is_verified!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
    otp!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    phone!: string;

  @Column({ type: 'datetime', nullable: true })
    created_at!: Date;
}
