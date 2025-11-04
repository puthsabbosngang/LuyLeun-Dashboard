import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { GeoCommune } from './GeoCommune';
import { ApplicationRelative } from './ApplicationRelative';

@Entity({ name: 'geo_commune_application_relatives' })
@Unique('UK_gi7ywhs5eaf2achj15rutyhkk', ['application_relatives_id'])
export class GeoCommuneApplicationRelatives {
  @PrimaryColumn()
    geo_commune_id!: number;

  @PrimaryColumn()
    application_relatives_id!: number;

  @ManyToOne(() => GeoCommune, (geoCommune) => geoCommune.geoCommuneRelatives, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'geo_commune_id' })
    geoCommune!: GeoCommune;

  @ManyToOne(() => ApplicationRelative, (relative) => relative.geo_commune, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'application_relatives_id' })
    applicationRelative!: ApplicationRelative;
}
