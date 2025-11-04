import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from './Application';
import { GeoCommune } from './GeoCommune';

@Entity({ name: 'application_government_officer' })
export class ApplicationGovernmentOfficer {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    company_addr!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    company_name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    company_phone!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    current_working_duration!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    industry_sector!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    industry!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    payroll_bank!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    payroll_date!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    position!: string;

  @Column({ type: 'float', nullable: true })
    salary!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    total_working_duration!: string;

  @Column({ type: 'int', nullable: true })
    application_id!: number;

  @Column({ type: 'int', nullable: true })
    geo_commune_id!: number;

  @ManyToOne(() => Application, (application) => application.governmentOfficers, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn({ name: 'application_id' })
    application!: Application;

  @ManyToOne(() => GeoCommune, (commune) => commune.governmentOfficers, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn({ name: 'geo_commune_id' })
    geo_commune!: GeoCommune;
}
