import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Application } from './Application';
import { GeoCommune } from './GeoCommune';

@Entity({ name: 'application_relative' })
export class ApplicationRelative {
  @PrimaryGeneratedColumn()
    id!: number;

  @CreateDateColumn({ type: 'datetime', precision: 6, nullable: true })
    created_at!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
    addr!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    phone!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    relation_type!: string;

  @UpdateDateColumn({ type: 'datetime', precision: 6, nullable: true })
    updated_at!: Date;

  @Column({ type: 'int', nullable: true })
    application_id!: number;

  @Column({ type: 'int', nullable: true })
    geo_commune_id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    occupation_type!: string;

  @ManyToOne(() => Application, (application) => application.relatives, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn({ name: 'application_id' })
    application!: Application;

  @ManyToOne(() => GeoCommune, (commune) => commune.relatives, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn({ name: 'geo_commune_id' })
    geo_commune!: GeoCommune;
}
