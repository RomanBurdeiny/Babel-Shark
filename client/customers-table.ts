import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {
  Customers,
  Positions,
  type CustomerDoc,
} from '../imports/api/collections';
import './customers-table.html';

type RowView = {
  _id: string;
  customerId: number;
  fullName: string;
  positionKey: string;
  positionLabelPlain: string;
};

function buildRows(): RowView[] {
  return Customers.find({}, { sort: { customerId: 1 } })
    .fetch()
    .map((c: CustomerDoc) => {
      const pos = Positions.findOne({ key: c.positionKey });
      const positionLabelPlain = pos?.labelEn ?? c.positionKey;
      return {
        _id: c._id!,
        customerId: c.customerId,
        fullName: c.fullName,
        positionKey: c.positionKey,
        positionLabelPlain,
      };
    });
}

type CustomersTableTemplateInstance = Blaze.TemplateInstance & {
  _positionObserver?: MutationObserver;
};

Template.customersTable.helpers({
  customerRows(): RowView[] {
    return buildRows();
  },
});

/**
 * ТЗ: MutationObserver на .__t; при изменении DOM — Meteor.call('translate'), подмена textContent.
 */
function requestTranslationsForCells(container: HTMLElement): void {
  const cells = container.querySelectorAll<HTMLElement>('td.__t');
  cells.forEach((el) => {
    const key = el.getAttribute('data-position-key');
    if (!key) return;
    if (el.dataset.translateInFlight === key) return;

    const pos = Positions.findOne({ key });
    const expectedEn = pos?.labelEn ?? key;
    const visible = el.textContent?.trim() ?? '';

    if (el.dataset.translationDone === key && visible !== expectedEn) return;
    if (visible !== expectedEn) return;

    el.dataset.translateInFlight = key;
    requestAnimationFrame(() => {
      Meteor.call('translate', key, (err: Error | Meteor.Error | undefined, result: string) => {
        delete el.dataset.translateInFlight;
        if (err) return;
        if (el.getAttribute('data-position-key') !== key) return;
        el.textContent = result;
        el.dataset.translationDone = key;
      });
    });
  });
}

Template.customersTable.onRendered(function (
  this: CustomersTableTemplateInstance,
) {
  const table = this.find('table');
  if (!(table instanceof HTMLTableElement)) return;
  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  let raf = 0;
  const schedule = (): void => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      raf = 0;
      requestTranslationsForCells(tbody);
    });
  };

  const observer = new MutationObserver(() => {
    schedule();
  });

  observer.observe(tbody, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  this._positionObserver = observer;
  schedule();
});

Template.customersTable.onDestroyed(function (
  this: CustomersTableTemplateInstance,
) {
  this._positionObserver?.disconnect();
});
