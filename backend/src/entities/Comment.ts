import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Application } from './Application';
import { User } from './User';

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    note!: string;

  @Column({ type: 'int', nullable: true })
    application_id!: number;

  @Column({ type: 'int', nullable: true })
    staff_id!: number;

  @Column({ type: 'int', nullable: true })
    user_id!: number;

  @CreateDateColumn({ type: 'datetime', precision: 6, nullable: true })
    created_at!: Date;

  @UpdateDateColumn({ type: 'datetime', precision: 6, nullable: true })
    updated_at!: Date;

  @ManyToOne(() => Application, (application) => application.comments, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn({ name: 'application_id' })
    application!: Application;

  @ManyToOne(() => User, (user) => user.staffComments, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn({ name: 'staff_id' })
    staff!: User;

  @ManyToOne(() => User, (user) => user.userComments, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn({ name: 'user_id' })
    user!: User;
}
