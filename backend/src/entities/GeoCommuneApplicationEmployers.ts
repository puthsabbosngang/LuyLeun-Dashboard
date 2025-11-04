import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { GeoCommune } from './GeoCommune';
import { ApplicationEmployer } from './ApplicationEmployer';

@Entity({ name: 'geo_commune_application_employers' })
@Unique('UK_1cnxe7d5d35aaulx0l13gn6t1', ['application_employers_id'])
export class GeoCommuneApplicationEmployers {
  @PrimaryColumn()
    geo_commune_id!: number;

  @PrimaryColumn()
    application_employers_id!: number;

  @ManyToOne(() => GeoCommune, (geoCommune) => geoCommune.geoCommuneEmployees, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'geo_commune_id' })
    geoCommune!: GeoCommune;

  @ManyToOne(() => ApplicationEmployer, (employer) => employer.geo_commune, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'application_employers_id' })
    applicationEmployer!: ApplicationEmployer;
}
