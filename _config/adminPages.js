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
  },
  accumulated: {
    permission: 'ifulfillment.orders.index',
    activated: true,
    authenticated: true,
    path: '/fulfillment/accumulated/index',
    name: 'qfulfillment.admin.accumulated.index',
    page: () => import('modules/qfulfillment/_pages/accumulated'),
    layout: () => import('layouts/master.vue'),
    title: 'ifulfillment.cms.sidebar.adminAccumulated',
    icon: 'fa-light fa-page-caret-down',
    subHeader: {
      refresh: true,
      breadcrumb: ['qfulfillment.orders']
    }
  },
  programming: {
    permission: 'ifulfillment.orders.index',
    activated: true,
    authenticated: true,
    path: '/fulfillment/programming/index',
    name: 'qfulfillment.admin.programming.index',
    page: () => import('modules/qfulfillment/_pages/programming'),
    layout: () => import('layouts/master.vue'),
    title: 'ifulfillment.cms.sidebar.adminProgramming',
    icon: 'fa-light fa-conveyor-belt-boxes',
    subHeader: {
      refresh: true,
      breadcrumb: ['qfulfillment.accumulated']
    }
  }
};
