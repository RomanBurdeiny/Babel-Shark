declare module 'meteor/vlasky:mysql' {
  export class LiveMysql {
    constructor(settings: Record<string, unknown>);
    select(
      sql: string,
      params: null | unknown,
      keySelector: unknown,
      tables: Array<{ table: string }>,
    // LiveMysqlSelect — курсор для Meteor.publish
    ): any;
  }

  export const LiveMysqlKeySelector: {
    Index(): unknown;
  };
}
