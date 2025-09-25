<template>
</template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid()
    };
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        apiRoute: 'apiRoutes.qfulfillment.orders',
        permission: 'ifulfillment.orders',
        create: {
          title: this.$tr('ifulfillment.cms.newOrder'),
          to: { name: 'qfulfillment.admin.orders.create' }
        },
        read: {
          columns: [
            {
              name: 'id',
              label: this.$tr('isite.cms.form.id'),
              field: 'id',
              style: 'width: 50px',
              align: 'left'
            },
            {
              name: 'account',
              label: this.$tr('isite.cms.form.customer'),
              field: 'account',
              align: 'left',
              format: (val) => (val ? val.title : '-')
            },
            {
              name: 'externalId',
              label: this.$tr('ifulfillment.cms.externalId'),
              field: 'externalId',
              align: 'left'
            },
            {
              name: 'quantity',
              label: this.$tr('ifulfillment.cms.quantity'),
              field: 'quantity',
              align: 'left'
            },
            {
              name: 'price',
              label: this.$tr('ifulfillment.cms.price'),
              field: 'price',
              align: 'left',
              format: (val) => this.$trn(val)
            },
            {
              name: 'created_at',
              label: this.$tr('isite.cms.form.createdAt'),
              field: 'createdAt',
              align: 'left',
              format: (val) => (val ? this.$trd(val) : '-')
            },
            {
              name: 'actions',
              label: this.$tr('isite.cms.form.actions'),
              align: 'left'
            }
          ],
          requestParams: {
            include: 'account'
          }
        },
        update: {
          title: this.$tr('ifulfillment.cms.updateOrder')
        },
        delete: false,
        formLeft: {}
      };
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    },

    customLocatable() {
      return {
        read: {
          requestParams: {
            filter: {
              entityType: 'Modules\\ifulfillment\\Models\\Account',
              entityId: this.locatableModal.row.id
            },
            include:
              'translations,country.translations,province.translations,city.translations'
          }
        },
        formLeft: {
          entityType: { value: 'Modules\\ifulfillment\\Models\\Account' },
          entityId: { value: this.locatableModal.row.id }
        }
      };
    },
    customContactItems() {
      return {
        read: {
          requestParams: {
            filter: {
              entityType: 'Modules\\ifulfillment\\Models\\Account',
              entityId: this.contactItemsModal.row.id
            },
            include: 'translations'
          }
        },
        formLeft: {
          entityType: { value: 'Modules\\ifulfillment\\Models\\Account' },
          entityId: { value: this.contactItemsModal.row.id }
        }
      };
    }
  }
};
</script>
