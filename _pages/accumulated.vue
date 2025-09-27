<template>
  <div id="pageId" class="relative-position">
    <page-actions :title="$tr($route.meta.title)" class="q-mb-md" @refresh="init" />

    <div class="box box-auto-height q-mb-md">
      <div class="box-title q-mb-md">
        <q-icon name="fa-light fa-filter" class="q-mr-sm" />
        Filtros
      </div>
      <div class="row q-col-gutter-md">
        <div class="col">
          <dynamic-field
            v-model="filter.shoeId"
            :field="dynamicFields.byShoe"
            @update:modelValue="filter.accountId = null; getOrderItems()"
          />
        </div>
        <div class="col">
          <dynamic-field
            v-model="filter.accountId"
            :field="dynamicFields.byAccount"
            @update:modelValue="filter.shoeId = null; getOrderItems()"
          />
        </div>
      </div>
      <div class="q-mb-md text-info">
        <q-icon name="fa-light fa-circle-info" size="sm" class="q-mr-md" />
        Debes seleccionar un filtro para ver el acumulado, puedes filtrar por referencia o por cliente.
      </div>
    </div>

    <div class="box" v-if="orderItems.length">
      <q-table
        flat bordered separator="cell"
        :rows="orderItems"
        :columns="columns"
        row-key="id"
        hide-pagination
        :pagination="pagination"
      >
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <!-- id -->
            <div v-if="props.col.name == 'id'">
              Orden Compra: {{ props.value }}
              <div class="text-caption text-grey">
                Cliente: {{ props.row.order.externalId }}
              </div>
            </div>
            <!-- dueDate -->
            <div v-else-if="props.col.name == 'dueDate'">
              <div class="row items-center no-wrap">
                <q-icon
                  name="fas fa-hourglass-end"
                  :color="props.row.colorDaysOff"
                  class="q-mr-sm" size="xs"
                />
                <div>
                  {{ props.value }}
                  <div class="text-caption text-grey">
                    {{ props.row.daysOff }} Días restantes
                  </div>
                </div>
              </div>
            </div>
            <!-- shoe -->
            <div v-else-if="props.col.name == 'shoe'">
              <div class="row items-center no-wrap">
                <div class="q-mr-sm">
                  <help-text
                    :title="props.row.shoe.title"
                    :description="props.row.labelOptions"
                  />
                </div>
                <div>
                  {{ props.row.shoe.title }}
                  <div class="text-caption text-grey">
                    {{ props.row.options.length }} Opciones
                  </div>
                </div>
              </div>
            </div>
            <div v-else>{{ props.value }}</div>
          </q-td>
        </template>

        <template v-slot:bottom-row>
          <q-tr class="bg-grey-1 text-bold">
            <!-- Celdas fijas de la izquierda: ajusta el colspan según tus columnas fijas -->
            <q-td :colspan="5" class="text-blue-grey">Totales</q-td>
            <!-- Totales por talla -->
            <q-td
              v-for="size in sizeRange"
              :key="`tot-${size}`"
              :class="sizeTotals.bySize[size] ? 'text-blue' : 'text-blue-grey'"
            >
              {{ sizeTotals.bySize[size] }}
            </q-td>
            <!-- Total general -->
            <q-td class="text-right bg-blue text-bold text-white">
              {{ sizeTotals.grand }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <inner-loading :visible="loading" />
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  data() {
    return {
      loading: false,
      orderItems: [],
      sizes: { min: 34, max: 46 },
      pagination: {
        page: 1,
        rowsPerPage: 0
      },
      filter: {
        shoeId: null,
        accountId: null
      }
    };
  },
  computed: {
    columns() {
      let columns = [
        {
          name: 'id',
          label: 'ID',
          field: 'order',
          align: 'left',
          format: val => val.id
        },
        {
          name: 'dueDate',
          label: this.$tr('ifulfillment.cms.dueDate'),
          field: 'order',
          align: 'left',
          format: val => val.dueDate
        },
        {
          name: 'shoe',
          label: 'Referencia',
          field: 'shoe',
          align: 'left',
          format: val => val.title
        },
        {
          name: 'account',
          label: 'Cliente',
          field: 'order',
          align: 'left',
          format: val => val.account.title
        },
        {
          name: 'location',
          label: 'Ciudad',
          field: 'order',
          align: 'left',
          format: val => val.locatable.city.name
        }
      ];

      for (let i = this.sizes.min; i <= this.sizes.max; i++) {
        columns.push({
          name: i, label: i, field: i, align: 'center',
          classes: row => row[i] ? 'text-blue text-weight-bold' : 'text-blue-grey'
        });
      }

      columns.push({
        name: 'total',
        label: 'Total',
        field: 'quantity',
        align: 'right',
        classes: 'bg-grey-1 text-bold text-blue-grey'
      });
      return columns;
    },
    sizeRange() {
      const arr = [];
      for (let i = this.sizes.min; i <= this.sizes.max; i++) arr.push(i);
      return arr;
    },
    // Totales por talla (columna) y total general
    sizeTotals() {
      const totals = {};
      this.sizeRange.forEach(size => (totals[size] = 0));
      let grand = 0;
      this.orderItems.forEach(row => {
        this.sizeRange.forEach(size => {
          const v = Number(row[size] || 0);
          totals[size] += v;
          grand += v;
        });
      });

      return { bySize: totals, grand };
    },
    // Campos dinámicos para filtros
    dynamicFields() {
      return {
        byShoe: {
          type: 'select',
          props: {
            label: 'Referencia'
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qfulfillment.orderItems',
            requestParams: { filter: { getUniqueShoes: true }, include: 'shoe.translations' },
            select: {
              label: row => row.shoe.title,
              sublabel: row => this.$trn(parseInt(row.shoesQuantity)) + ' Pares',
              id: row => row.shoe.id
            }
          }
        },
        byAccount: {
          type: 'select',
          props: {
            label: 'Cliente'
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qfulfillment.orders',
            requestParams: { filter: { getUniqueAccounts: true }, include: 'account' },
            select: {
              label: row => row.account.title,
              sublabel: row => this.$trn(parseInt(row.shoesQuantity)) + ' Pares',
              id: row => row.account.id
            }
          }
        }
      };
    }
  },
  methods: {
    init() {
    },
    //Get data
    getOrderItems() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        //Requets params
        let requestParams = {
          refresh: true,
          params: {
            include: 'order.account,order.locatable.city.translations,shoe.translations',
            filter: { orderByDueDate: 'asc' }
          }
        };
        //Filters
        if(this.filter.shoeId) requestParams.params.filter.shoeId = this.filter.shoeId;
        if(this.filter.accountId) requestParams.params.filter.accountId = this.filter.accountId;
        //Request
        this.$crud.index('apiRoutes.qfulfillment.orderItems', requestParams).then(response => {
          this.orderItems = response.data.map(i => this.mapOrderItem(i));
          this.loading = false;
        }).catch(error => {
          this.loading = false;
        });
      });
    },
    mapOrderItem(item = null) {
      const shoe = item.shoe;
      const selectedOptions = item.options;
      const daysOff = this.$date.getDaysDiff(`${item.order.dueDate} 23:59:59`);
      let newRow = {
        ...item,
        daysOff,
        colorDaysOff: daysOff < 3 ? 'red' : daysOff < 7 ? 'orange' : 'green',
        labelOptions: selectedOptions.map(i => {
          let label = i.title;
          if (i.parent) label = `[${i.parent.title}] ${i.title}`;
          return `<div class="text-caption text-blue-grey">- ${label}</div>`;
        }).join('')
      };

      for (let i = this.sizes.min; i <= this.sizes.max; i++) {
        const itemSize = item?.sizes?.find(s => s.size == i);
        newRow[i] = itemSize ? itemSize.quantity : 0;
      }

      return newRow;
    }
  }
};
</script>
<style lang="stylus">
</style>
