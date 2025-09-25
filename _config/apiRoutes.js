const moduleName = 'ifulfillment';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`;

export default {
  urlBase: urlBase,
  version: moduleVersion,
  orders: `${urlBase}/orders`
};
