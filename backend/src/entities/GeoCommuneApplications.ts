import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { GeoCommune } from './GeoCommune';
import { Application } from './Application';

@Entity({ name: 'geo_commune_applications' })
@Unique('UK_jojef11kml2fscwbspd03thb7', ['applications_id'])
export class GeoCommuneApplications {
  @PrimaryColumn()
    geo_commune_id!: number;

  @PrimaryColumn()
    applications_id!: number;

  @ManyToOne(() => GeoCommune, (geoCommune) => geoCommune.geoCommuneApplications, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'geo_commune_id' })
    geoCommune!: GeoCommune;

  @ManyToOne(() => Application, (application) => application.geoCommune, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'applications_id' })
    application!: Application;
}
