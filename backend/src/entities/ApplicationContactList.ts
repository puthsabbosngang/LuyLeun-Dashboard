import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from './Application';

@Entity({ name: 'application_contact_list' })
export class ApplicationContactList {
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
    application_id!: number;

  @ManyToOne(() => Application, (application) => application.contactLists, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn({ name: 'application_id' })
    application!: Application;
}
