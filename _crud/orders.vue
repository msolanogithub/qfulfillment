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
              label: this.$tr('ifulfillment.cms.account'),
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
              label: this.$tr('isite.cms.form.quantity'),
              field: 'quantity',
              align: 'left',
              format: val => this.$trn(val)
            },
            {
              name: 'city',
              label: this.$tr('isite.cms.form.city'),
              field: 'locatable',
              align: 'left',
              format: val => val.city.title
            },
            {
              name: 'dueDate',
              label: this.$tr('ifulfillment.cms.dueDate'),
              field: 'dueDate',
              align: 'left',
              format: val => this.$trd(val, {type: 'small'})
            },
            {
              name: 'comment',
              label: this.$tr('isite.cms.form.comment'),
              field: 'comment',
              align: 'left'
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
            include: 'account,locatable.city.translations'
          },
          filters: {
            accountId: {
              type: 'select',
              props: {
                label: 'Cliente',
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qaccount.accounts',
                select: {
                  label: 'title',
                  id: 'id',
                  sublabel: i => `${i.documentType.title}: ${i.document}`
                }
              }
            },
            cityId: {
              type: 'select',
              props: {
                label: 'Ciudad',
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qfulfillment.orderGroupData',
                requestParams: { filter: { getUniqueCities: true } },
                select: { label: 'title', id: 'id' }
              }
            }
          }
        },
        update: {
          title: this.$tr('ifulfillment.cms.updateOrder'),
          to: 'qfulfillment.admin.orders.update'
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
