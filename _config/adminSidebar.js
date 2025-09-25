import pages from 'src/setup/pages'; // Get Pages from config

//Blog
export default [
  {
    title: 'ifulfillment.cms.sidebar.adminFulfillment',
    icon: 'fa-light fa-arrow-progress',
    children: [
      pages.qfulfillment.orders
    ]
  }
];
