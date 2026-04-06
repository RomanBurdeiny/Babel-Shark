import { DataSource } from 'typeorm';
import { PositionEntity } from './entities/position.entity';
import { CustomerEntity } from './entities/customer.entity';
import { TranslationEntity } from './entities/translation.entity';

/** Одна конфигурация с `Meteor.settings.mysql` (как для vlasky:mysql). */
export type MeteorMysqlSettings = {
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
  serverId?: number;
};

export let AppDataSource: DataSource;

export async function initTypeormMysql(
  m: MeteorMysqlSettings,
): Promise<void> {
  AppDataSource = new DataSource({
    type: 'mysql',
    host: m.host,
    port: Number(m.port ?? 3306),
    username: m.user,
    password: m.password,
    database: m.database,
    synchronize: true,
    logging: false,
    entities: [PositionEntity, CustomerEntity, TranslationEntity],
  });
  await AppDataSource.initialize();
}
