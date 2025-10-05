const moduleName = 'ifulfillment';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`;

export default {
  urlBase: urlBase,
  version: moduleVersion,
  orders: `${urlBase}/orders`,
  orderItems: `${urlBase}/order-items`,
  shipments: `${urlBase}/shipments`,
  shipmentItems: `${urlBase}/shipment-items`,
  shipmentItemStages: `${urlBase}/shipment-item-stages`,
  shipmentItemsGroupData: `${urlBase}/shipment-items/group/filter-data`,
  supplierTypes : `${urlBase}/supplier-types`,
};
