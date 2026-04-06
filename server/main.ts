import 'reflect-metadata';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { LiveMysql, LiveMysqlKeySelector } from 'meteor/vlasky:mysql';
import { initTypeormMysql, type MeteorMysqlSettings } from './db/data-source';
import { seedMysqlIfEmpty } from './db/seed-mysql';
import { TranslationEntity } from './db/entities/translation.entity';

const mysql = Meteor.settings?.mysql as MeteorMysqlSettings | undefined;
if (!mysql) {
  throw new Error(
    'Задайте Meteor.settings.mysql. Запуск: meteor run --settings settings.json',
  );
}

let liveDb: LiveMysql | undefined;

function waitForLiveMysql(): Promise<LiveMysql> {
  if (liveDb) return Promise.resolve(liveDb);
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + 60_000;
    const iv = setInterval(() => {
      if (liveDb) {
        clearInterval(iv);
        resolve(liveDb);
      } else if (Date.now() > deadline) {
        clearInterval(iv);
        reject(new Error('Таймаут инициализации LiveMysql (vlasky:mysql)'));
      }
    }, 10);
  });
}

Meteor.startup(async () => {
  await initTypeormMysql(mysql);
  await seedMysqlIfEmpty();
  liveDb = new LiveMysql(mysql);
});

/**
 * Реактивная публикация напрямую из MySQL (vlasky:mysql).
 * Имя публикации = имя локальной коллекции в minimongo.
 */
Meteor.publish('positions', async function () {
  const db = await waitForLiveMysql();
  return db.select(
    'SELECT id, `key`, label_en AS labelEn FROM positions ORDER BY id ASC',
    null,
    LiveMysqlKeySelector.Index(),
    [{ table: 'positions' }],
  ) as Mongo.Cursor<unknown> | Mongo.Cursor<unknown>[] | void;
});

Meteor.publish('customers', async function () {
  const db = await waitForLiveMysql();
  return db.select(
    'SELECT id, customer_id AS customerId, full_name AS fullName, position_key AS positionKey FROM customers ORDER BY customer_id ASC',
    null,
    LiveMysqlKeySelector.Index(),
    [{ table: 'customers' }],
  ) as Mongo.Cursor<unknown> | Mongo.Cursor<unknown>[] | void;
});

Meteor.methods({
  async translate(termKey: string): Promise<string> {
    check(termKey, String);
    const doc = await TranslationEntity.findOneBy({ termKey });
    return doc?.textRu ?? termKey;
  },
});
