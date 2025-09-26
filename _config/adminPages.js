export default {
  orders: {
    permission: 'ifulfillment.orders.manage',
    activated: true,
    authenticated: true,
    path: '/fulfillment/orders/index',
    name: 'qfulfillment.admin.orders.index',
    crud: import('modules/qfulfillment/_crud/orders'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'ifulfillment.cms.sidebar.adminOrders',
    icon: 'fa-light fa-file-invoice',
    subHeader: {
      refresh: true
    }
  },
  createOrder: {
    permission: 'ifulfillment.orders.create',
    activated: true,
    authenticated: true,
    path: '/fulfillment/orders/create',
    name: 'qfulfillment.admin.orders.create',
    page: () => import('modules/qfulfillment/_pages/formOrder'),
    layout: () => import('layouts/master.vue'),
    title: 'ifulfillment.cms.sidebar.adminNewOrder',
    icon: 'fa-light fa-file-invoice',
    subHeader: {
      refresh: true,
      breadcrumb: ['qfulfillment.orders']
    }
  },
  updateOrder: {
    permission: 'ifulfillment.orders.edit',
    activated: true,
    authenticated: true,
    path: '/fulfillment/orders/update/:id',
    name: 'qfulfillment.admin.orders.update',
    page: () => import('modules/qfulfillment/_pages/formOrder'),
    layout: () => import('layouts/master.vue'),
    title: 'ifulfillment.cms.sidebar.adminUpdateOrder',
    icon: 'fa-light fa-file-invoice',
    subHeader: {
      refresh: true,
      breadcrumb: ['qfulfillment.orders']
    }
  }
};
