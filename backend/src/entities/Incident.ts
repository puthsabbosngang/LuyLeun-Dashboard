import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'incident' })
@Index('national_id', ['nid'])
@Index('applicant_name', ['name'])
@Index('dob', ['dob'])
@Index('phone1', ['phone1'])
@Index('phone2', ['phone2'])
@Index('phone3', ['phone3'])
export class Incident {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    dob!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    phone1!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    phone2!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    phone3!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    nid!: string;
}
