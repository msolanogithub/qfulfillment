<template>
  <div id="programmingIfulfillment" class="relative-position">
    <page-actions :title="$tr($route.meta.title)" class="q-mb-md" @refresh="getShipmentItems" />

    <div class="box box-auto-height q-mb-md">
      <div class="box-title q-mb-md row justify-between items-center">
        <div>
          <q-icon name="fa-light fa-filter" class="q-mr-sm" />
          Filtros
        </div>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col">
          <dynamic-field
            v-model="filter.shoeId"
            :field="dynamicFields.byShoe"
            @update:modelValue="filter.accountId = null; getShipmentItems()"
          />
        </div>
        <div class="col">
          <dynamic-field
            v-model="filter.accountId"
            :field="dynamicFields.byAccount"
            @update:modelValue="filter.shoeId = null; getShipmentItems()"
          />
        </div>
      </div>
      <div class="q-mb-md text-info">
        <q-icon name="fa-light fa-circle-info" size="sm" class="q-mr-md" />
        Aqui se muestra las refrencias programadas desde el acumulado y sin despacho definido.
      </div>
    </div>

    <div class="box" v-if="shipmentItems.length">
      <q-table
        flat bordered separator="cell"
        :rows="shipmentItems"
        :columns="columns"
        row-key="id"
        hide-pagination
        :pagination="pagination"
      >
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <!-- id -->
            <div v-if="props.col.name == 'id'">
              Orden Producción: <b>{{ props.value }}</b>
              <div class="text-caption text-grey">
                Cliente: {{ props.row.orderItem.order.account.title }}
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
            <!-- createdAt -->
            <div v-else-if="props.col.name == 'createdAt'">
              {{ props.value }}
              <div class="text-caption text-grey">
                {{ props.row.daysFromCreation }} Días Transcurridos
              </div>
            </div>
            <!-- shoe -->
            <div v-else-if="props.col.name == 'shoe'">
              <div class="row items-center no-wrap">
                <div class="q-mr-sm">
                  <help-text
                    :title="props.row.orderItem.shoe.title"
                    :description="props.row.labelOptions"
                  />
                </div>
                <div>
                  {{ props.row.orderItem.shoe.title }}
                  <div class="text-caption text-grey">
                    {{ props.row.orderItem.options.length }} Opciones
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
            <q-td :colspan="4" class="text-blue-grey text-right">Totales</q-td>
            <!-- Totales por talla -->
            <q-td
              v-for="size in sizeRange"
              :key="`tot-${size}`"
              :class="sizeTotals.bySize[size] ? 'text-blue' : 'text-blue-grey'"
            >
              {{ $trn(sizeTotals.bySize[size]) }}
            </q-td>
            <!-- Total general -->
            <q-td class="text-center text-blue text-bold">
              {{ $trn(sizeTotals.grand) }}
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
      programming: false,
      shipmentItems: [],
      sizes: { min: 33, max: 46 },
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
    // Campos dinámicos para filtros
    dynamicFields() {
      return {
        byShoe: {
          type: 'select',
          props: {
            label: 'Referencia',
            clearable: true
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qfulfillment.shipmentItemsGroupData',
            requestParams: { filter: { getUniqueShoes: true } },
            select: {
              label: row => row.title,
              sublabel: row => this.$trn(parseInt(row.quantity)) + ' Pares',
              id: row => row.id
            }
          }
        },
        byAccount: {
          type: 'select',
          props: {
            label: 'Cliente',
            clearable: true
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qfulfillment.shipmentItemsGroupData',
            requestParams: { filter: { getUniqueAccounts: true } },
            select: {
              label: row => row.title,
              sublabel: row => this.$trn(parseInt(row.quantity)) + ' Pares',
              id: row => row.id
            }
          }
        }
      };
    },
    columns() {
      let columns = [
        {
          name: 'id',
          label: 'ID',
          field: 'orderItem',
          align: 'left',
          format: val => val.order.id
        },
        {
          name: 'dueDate',
          label: this.$tr('ifulfillment.cms.dueDate'),
          field: 'orderItem',
          align: 'left',
          format: val => this.$trd(val.order.dueDate, { type: 'small' })
        },
        {
          name: 'createdAt',
          label: 'Fecha de Programación',
          field: 'createdAt',
          align: 'left',
          format: val => this.$trd(val, { type: 'small' })
        },
        {
          name: 'shoe',
          label: 'Referencia',
          field: 'orderItem',
          align: 'left',
          format: val => val.shoe.title
        }
      ];

      for (let i = this.sizes.min; i <= this.sizes.max; i++) {
        columns.push({
          name: i, label: i, field: i, align: 'center',
          classes: row => [
            row[i] ? 'text-blue text-bold' : 'text-blue-grey',
            row[i] && this.programming ? 'cursor-pointer' : ''
          ].join(' ')
        });
      }

      columns.push({
        name: 'total',
        label: 'Total',
        field: 'quantity',
        align: 'center',
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
      this.shipmentItems.forEach(row => {
        this.sizeRange.forEach(size => {
          const v = Number(row[size] || 0);
          totals[size] += v;
          grand += v;
        });
      });

      return { bySize: totals, grand };
    }
  },
  methods: {
    init() {
      this.getShipmentItems();
    },
    //Get data
    getShipmentItems() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        //Requets params
        let requestParams = {
          refresh: true,
          params: {
            include: 'orderItem.order.account,orderItem.shoe.translations',
            filter: { shipmentId: { where: 'null' } },
            order: {field: 'created_at', way: 'asc'}
          }
        };
        //Filters
        if (this.filter.shoeId) requestParams.params.filter.shoeId = this.filter.shoeId;
        if (this.filter.accountId) requestParams.params.filter.accountId = this.filter.accountId;
        //Request
        this.$crud.index('apiRoutes.qfulfillment.shipmentItems', requestParams).then(response => {
          this.shipmentItems = response.data.map(i => this.mapShipmentItem(i));
          this.loading = false;
        }).catch(error => {
          this.loading = false;
        });
      });
    },
    mapShipmentItem(item = null) {
      const shoe = item.orderItem.shoe;
      const selectedOptions = item.orderItem.options;
      const order = item.orderItem.order;
      const now = this.$moment();
      const daysOff = this.$date.getDaysDiff(`${order.dueDate} 23:59:59`);
      const daysFromCreation = now.diff(this.$moment(item.createdAt), 'days');

      let newRow = {
        ...item,
        daysOff,
        daysFromCreation,
        colorDaysOff: daysOff < 3 ? 'red' : daysOff < 7 ? 'orange' : 'green',
        labelOptions: selectedOptions.map(i => {
          let label = i.title;
          if (i.parent) label = `[${i.parent.title}] ${i.title}`;
          return `<div class="text-caption text-blue-grey">- ${label}</div>`;
        }).join('')
      };

      for (let i = this.sizes.min; i <= this.sizes.max; i++) {
        const itemSize = item.sizes?.find(s => s.size == i);
        const sizeQuantity = (itemSize ? itemSize.quantity : 0);
        newRow[i] = sizeQuantity;
      }

      return newRow;
    }
  }
};
</script>
<style lang="stylus">
</style>
