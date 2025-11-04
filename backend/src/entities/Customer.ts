import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'customer' })
export class Customer {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    addr!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    cohabitation!: string;

  @Column({ type: 'int', nullable: true })
    living_duration!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    owner!: string;

  @Column({ type: 'datetime', nullable: true })
    created_at!: Date;

  @Column({ type: 'datetime', nullable: true })
    dob!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
    employment_agreement_file!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    national_id_file!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    payslip!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    selfie_file!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    signature_file!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    edu_lvl!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    gender!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    marital_status!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    n_id!: string;

  @Column({ type: 'datetime', nullable: true })
    n_id_expiry_date!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
    name_en!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    name_kh!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    phone!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    referral_code!: string;

  @Column({ type: 'varbinary', length: 255, nullable: true })
    social_profiles!: Buffer;

  @Column({ type: 'varchar', length: 255, nullable: true })
    status!: string;

  @Column({ type: 'datetime', nullable: true })
    updated_at!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
    gcp_url!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    file_employment_agreement!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    file_national_id!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    file_payslip!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    file_photo!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    file_signature!: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'user_id' })
    user!: User;
}
