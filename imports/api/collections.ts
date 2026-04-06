import { Mongo } from 'meteor/mongo';

/**
 * Локальные коллекции minimongo: данные приходят из MySQL через vlasky:mysql
 * Имена совпадают с публикациями из MySQL.
 */
export interface CustomerDoc {
  _id?: string;
  id?: number;
  customerId: number;
  fullName: string;
  positionKey: string;
}

export interface PositionDoc {
  _id?: string;
  id?: number;
  key: string;
  labelEn: string;
}

export const Customers = new Mongo.Collection<CustomerDoc>('customers');
export const Positions = new Mongo.Collection<PositionDoc>('positions');
