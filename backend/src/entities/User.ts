import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Staff } from "./Staff";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  n_id!: string;

  @Column({ nullable: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  status!: string;

  @Column({ nullable: true })
  otp!: string;

  @Column()
  type!: string; 

  @Column({ nullable: true })
  failed_login_attempt!: number;

  @Column({ type: "datetime", nullable: true })
  created_at!: Date;

  @Column({ type: "datetime", nullable: true })
  updated_at!: Date;

  @Column({ nullable: true })
  profile!: string;

  @Column({ type: "text", nullable: true })
  firebase_token!: string;

  @Column({ nullable: true })
  device_id!: string;

  @Column({ nullable: true })
  referral_code!: string;

  @Column({ nullable: true })
  account_name!: string;

  @Column({ nullable: true })
  account_number!: string;

  @Column({ nullable: true })
  settlement_account_name!: string;

  @Column({ nullable: true })
  settlement_account_number!: string;


  @OneToOne(() => Staff, (staff) => staff.user)
  staff!: Staff;
    staffComments: any;
    userComments: any;
    communications: any;
    leads: any;
}