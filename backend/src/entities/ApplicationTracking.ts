import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Application } from './Application';

@Entity({ name: 'application_tracking' })
export class ApplicationTracking {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    code!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    status!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    remark!: string;

  @Column({ type: 'int', nullable: true })
    application_id!: number;

  @CreateDateColumn({ type: 'datetime', precision: 6, nullable: true })
    created_at!: Date;

  @ManyToOne(() => Application, (application) => application.trackings, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn({ name: 'application_id' })
    application!: Application;
}
