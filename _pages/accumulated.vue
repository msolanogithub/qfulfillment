<template>
  <div id="pageId" class="relative-position">
    <page-actions :title="$tr($route.meta.title)" class="q-mb-md" @refresh="init" />

    <div class="box box-auto-height q-mb-md">
      <div class="box-title q-mb-md row justify-between items-center">
        <div>
          <q-icon name="fa-light fa-filter" class="q-mr-sm" />
          Filtros
        </div>
        <q-toggle
          v-model="allowDispatch"
          label="Crear Despachos"
          color="blue"
        />
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
            <!-- Dispatch -->
            <div v-else-if="props.col.name == 'dispatch'">
              <q-btn
                unelevated rounded no-caps
                label="Despachar"
                icon="fas fa-rocket"
                color="blue"
                @click="validateDispatchItem(props.row)"
              />
            </div>
            <!--- Tallas -->
            <div v-else-if="sizeRange.includes(props.col.name)">
              <span v-html="getSizeColumnValue(props.row, props.col.name)"></span>
              <q-popup-edit
                v-if="allowDispatch && props.row[props.col.name]"
                v-model="props.row[ getDispatchSizeLabelName(props.col.name) ]"
                color="blue-grey"
                v-slot="scope"
              >
                <div class="text-blue-grey q-mb-sm">
                  {{ props.row.shoe.title }}
                </div>
                <q-input
                  v-model="scope.value"
                  color="blue-grey"
                  :label="`Talla ${props.col.name} (${props.row[props.col.name]})`"
                  outlined autofocus
                  @keyup.enter="() => {
                    scope.value = validateDispatchQuantity(scope.value, props.row[props.col.name])
                    scope.set()
                  }"
                  type="number"
                  inputmode="numeric"
                  min="1"
                  step="1"
                  hint="Presiona Enter para guardar"
                />
              </q-popup-edit>
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
      allowDispatch: true,
      orderItems: [],
      sizes: { min: 33, max: 46 },
      pagination: {
        page: 1,
        rowsPerPage: 0
      },
      filter: {
        shoeId: 1,
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
          classes: row => [
            row[i] ? 'text-blue text-bold' : 'text-blue-grey',
            row[i] && this.allowDispatch ? 'cursor-pointer' : ''
          ].join(' ')
        });
      }

      columns.push({
        name: 'total',
        label: 'Total',
        field: 'quantity',
        align: 'right',
        classes: 'bg-grey-1 text-bold text-blue-grey'
      });

      //dispatch column
      if (this.allowDispatch) {
        columns.push({
          name: 'dispatch',
          label: 'Despacho',
          align: 'center',
          style: 'min-width: 180px;'
        });
      }

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
        if (this.filter.shoeId) requestParams.params.filter.shoeId = this.filter.shoeId;
        if (this.filter.accountId) requestParams.params.filter.accountId = this.filter.accountId;
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
        const sizeQuantity = itemSize ? itemSize.quantity : 0;
        newRow[i] = sizeQuantity;
        newRow[this.getDispatchSizeLabelName(i)] = sizeQuantity;
      }

      return newRow;
    },
    getDispatchSizeLabelName(size) {
      return `${size}Dispatch`;
    },
    getSizeColumnValue(row, size) {
      if (!row[size]) return row[size];
      const sizeQuantity = row[size];
      const dispatchQuantity = row[this.getDispatchSizeLabelName(size)] || 0;
      if (this.allowDispatch && sizeQuantity != dispatchQuantity) {
        return `<span class="text-orange">${dispatchQuantity}</span> / ${sizeQuantity}`;
      }
      return sizeQuantity;
    },
    validateDispatchQuantity(value, max) {
      let val = Number(value);
      if (isNaN(val) || val < 1 || val > max) val = max;
      return val;
    },
    validateDispatchItem(row) {
      const dispatchQuantity = this.sizeRange.reduce((sum, size) => {
        return sum + (Number(row[this.getDispatchSizeLabelName(size)]) || 0);
      }, 0);
      let quantityLabel = `<b class="text-blue">${row.quantity}</b>`;
      if (dispatchQuantity != row.quantity)
        quantityLabel = `<b class="text-orange">${dispatchQuantity}</b>/${quantityLabel}`;

      this.$alert.info({
        mode: 'modal',
        title: 'Confirmar Despacho',
        message: `<div class="text-blue-grey">
        <div><b>Cliente: </b> ${row.order.account.title}</div>
        <div><b>Cantidad: </b>${quantityLabel}</div>
        <div><b>Referencia: </b> ${row.shoe.title}</div>
        <div class="text-caption text-grey q-mt-sm">${row.labelOptions}</div>
        </div>
        `,
        actions: [
          { label: 'Cancelar', color: 'grey' },
          {
            label: 'Despachar',
            color: 'blue',
            handler: () => this.dispatchItem(row, dispatchQuantity)
          }
        ]
      });
    },
    dispatchItem(row, dispatchQuantity) {
      const dispatchData = {
        orderId: row.order.id,
        totalItems: dispatchQuantity,
        shippedAt: row.order.dueDate,
        items: [{
          orderItemId: row.id,
          quantity: dispatchQuantity,
          sizes: []
        }]
      };

      this.sizeRange.forEach(size => {
        dispatchData.items[0].sizes.push({
          size,
          quantity: row[this.getDispatchSizeLabelName(size)] || 0
        });
      });

      this.$crud.updateOrCreate(
        'apiRoutes.qfulfillment.shipments',
        {orderId: dispatchData.orderId},
        dispatchData
      )
        .then(response => {
          this.$alert.success('Despacho creado exitosamente');
          this.getOrderItems();
        }).catch(error => {
        this.$alert.error('Error al crear el despacho');
      });
    }
  }
};
</script>
<style lang="stylus">
</style>
