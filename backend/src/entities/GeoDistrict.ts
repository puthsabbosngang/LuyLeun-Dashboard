import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { GeoProvince } from './GeoProvince';
import { GeoCommune } from './GeoCommune';

@Entity({ name: 'geo_district' })
export class GeoDistrict {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ nullable: true })
    code!: string;

  @Column({ nullable: true })
    name_en!: string;

  @Column({ nullable: true })
    name_kh!: string;

  @Column({ nullable: true })
    prefix!: string;

  @Column({ type: 'int', nullable: true })
    total_commune!: number;

  @Column({ type: 'int', nullable: true })
    total_village!: number;

  @Column({ nullable: true })
    type_en!: string;

  @Column({ nullable: true })
    type_kh!: string;

  @ManyToOne(() => GeoProvince, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: true })
    @JoinColumn({ name: 'province_id' })
    province: GeoProvince = new GeoProvince;

  @OneToMany(() => GeoCommune, (commune) => commune.district)
    communes!: GeoCommune[];
}
