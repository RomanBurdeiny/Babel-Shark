import { Meteor } from 'meteor/meteor';

import './customers-table';

Meteor.startup(() => {
  Meteor.subscribe('customers');
  Meteor.subscribe('positions');
});
