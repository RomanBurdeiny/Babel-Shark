import { PositionEntity } from './entities/position.entity';
import { CustomerEntity } from './entities/customer.entity';
import { TranslationEntity } from './entities/translation.entity';

/**
 * Сид только через TypeORM Active Record (BaseEntity.create / .save).
 * Без EntityManager.insert и без repository.
 */
export async function seedMysqlIfEmpty(): Promise<void> {
  if ((await PositionEntity.count()) > 0) return;

  await PositionEntity.create({ key: 'officer', labelEn: 'officer' }).save();
  await PositionEntity.create({ key: 'manager', labelEn: 'manager' }).save();
  await PositionEntity.create({ key: 'operator', labelEn: 'operator' }).save();

  await CustomerEntity.create({
    customerId: 1,
    fullName: 'Dino Fabrello',
    positionKey: 'officer',
  }).save();
  await CustomerEntity.create({
    customerId: 2,
    fullName: 'Walter Marangoni',
    positionKey: 'manager',
  }).save();
  await CustomerEntity.create({
    customerId: 3,
    fullName: 'Angelo Ottogialli',
    positionKey: 'operator',
  }).save();

  await TranslationEntity.create({ termKey: 'officer', textRu: 'офицер' }).save();
  await TranslationEntity.create({ termKey: 'manager', textRu: 'менеджер' }).save();
  await TranslationEntity.create({ termKey: 'operator', textRu: 'оператор' }).save();
}
