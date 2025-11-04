import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Communication } from './Communication';

@Entity({ name: 'leads' })
export class Lead {
  @PrimaryGeneratedColumn()
    id!: number;

  @CreateDateColumn({ type: 'datetime', precision: 6, nullable: true })
    created_at!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
    name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    phone!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    remark!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    source!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    status!: string;

  @UpdateDateColumn({ type: 'datetime', precision: 6, nullable: true })
    updated_at!: Date;

  @Column({ type: 'int', nullable: true })
    sales_id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    reason!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    social_media_link!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    social_media_name!: string;

  @ManyToOne(() => User, (user) => user.leads, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn({ name: 'sales_id' })
    sales!: User;

  @OneToMany(() => Communication, (communication) => communication.lead)
    communications!: Communication[];
}
