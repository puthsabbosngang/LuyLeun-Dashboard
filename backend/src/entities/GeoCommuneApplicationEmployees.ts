import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { GeoCommune } from './GeoCommune';
import { ApplicationEmployee } from './ApplicationEmployee';

@Entity({ name: 'geo_commune_application_employees' })
@Unique('UK_oavnixvbx55n6n0smdte88h1o', ['application_employees_id'])
export class GeoCommuneApplicationEmployees {
  @PrimaryColumn()
  geo_commune_id!: number;

  @PrimaryColumn()
  application_employees_id!: number;

  @ManyToOne(() => GeoCommune, (geoCommune) => geoCommune.geoCommuneEmployees, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'geo_commune_id' })
  geoCommune!: GeoCommune;

  @ManyToOne(() => ApplicationEmployee, (employee) => employee.geo_commune, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'application_employees_id' })
  applicationEmployee!: ApplicationEmployee;
}
