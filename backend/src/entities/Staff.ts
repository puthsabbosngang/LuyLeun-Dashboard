import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("staff")
export class Staff {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  full_name!: string;

  @Column()
  role!: string;

  @Column()
  user_id!: number;

  @Column({ nullable: true })
  phone!: string;

  @OneToOne(() => User, (user) => user.staff)
  @JoinColumn({ name: "user_id" })
  user!: User;
}