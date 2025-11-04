import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GeoCommune } from './GeoCommune';

@Entity({ name: 'geo_village' })
export class GeoVillage {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    code!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    name_en!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    name_kh!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    prefix!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    type_en!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    type_kh!: string;

  @Column({ type: 'int', nullable: true })
    commune_id!: number;

  @ManyToOne(() => GeoCommune, (commune) => commune.villages, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'commune_id' })
    commune!: GeoCommune;
}
