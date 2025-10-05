<template>
  <div id="pageId" class="relative-position">
    <page-actions :title="$tr($route.meta.title)" class="q-mb-md" @refresh="getOrderItems" />

    <div class="box box-auto-height q-mb-md">
      <div class="box-title q-mb-md row justify-between items-center">
        <div>
          <q-icon name="fa-light fa-filter" class="q-mr-sm" />
          Filtros
        </div>
        <q-toggle
          v-model="programming"
          label="Crear Programación"
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
        Aqui se muestra el acumulado con cantidades pendientes por programar. Activa la acción de <b>Crear
        Programación</b>
        da click en las cantidades para ajustar la cantidad a programar y luego presiona el boton <b>Programar</b>.
        Si la cantidad a programar es menor a la pendiente, se hará una programación parcial.
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
              Orden Producción
              : {{ props.value }}
              <div class="text-caption text-grey">
                Orden Compra: {{ props.row.order.externalId }}
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
            <!-- Total -->
            <div v-else-if="props.col.name == 'total'">
              <q-btn
                v-if="programming"
                :disabled="!props.row.dispatchQuantity"
                unelevated rounded no-caps
                color="blue"
                @click="validateDispatchItem(props.row)"
              >
                <div class=" row items-center">
                  <q-icon name="fa-light fa-conveyor-belt-boxes" size="16px" class="q-mr-sm" />
                  {{ $trn(props.row.dispatchQuantity) }}
                </div>
                Programar
              </q-btn>
              <span v-else>{{ $trn(props.value) }}</span>
            </div>
            <!--- Tallas -->
            <div v-else-if="sizeRange.includes(props.col.name)">
              <span v-html="getSizeColumnValue(props.row, props.col.name)"></span>
              <q-popup-edit
                v-if="programming && props.row[props.col.name]"
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
                    setDispatchTotalQuantity(props.row)
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
            <q-td :colspan="5" class="text-blue-grey text-right">Totales</q-td>
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

    <master-modal
      v-model="confirmProgram.show"
      title="Confirmar Programación"
      icon="fa-light fa-conveyor-belt-boxes">
      <div class="relative-position">
        <div v-html="confirmProgram.body" />
        <dynamic-field
          v-model="confirmProgram.supplierId"
          :field="dynamicFields.supplierId"
          class="q-mb-md"
        />
        <div class="row justify-end q-gutter-sm">
          <q-btn
            rounded no-caps unelevated
            label="Cancel"
            color="grey"
            @click="confirmProgram.show = false"
          />
          <q-btn
            rounded no-caps unelevated
            label="Programar"
            :disabled="!confirmProgram.supplierId"
            color="green"
            @click="dispatchItem"
          />
        </div>
        <inner-loading :visible="confirmProgram.loading" />
      </div>
    </master-modal>

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
      orderItems: [],
      sizes: { min: 33, max: 46 },
      pagination: {
        page: 1,
        rowsPerPage: 0
      },
      filter: {
        shoeId: null,
        accountId: null
      },
      confirmProgram: {
        show: false,
        row: null,
        body: null,
        supplierId: null,
        loading: false
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
          format: val => this.$trd(val.dueDate, { type: 'small' })
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
            label: 'Referencia',
            clearable: true
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
            label: 'Cliente',
            clearable: true
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
        },
        supplierId: {
          type: 'select',
          props: {
            label: 'Proveedor *'
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qfulfillment.supplierTypes'
          }
        }
      };
    }
  },
  methods: {
    init() {
      this.getOrderItems();
    },
    //Get data
    getOrderItems() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        //Requets params
        let requestParams = {
          refresh: true,
          params: {
            include: 'order.account,order.locatable.city.translations,shoe.translations,shipmentItems',
            filter: { orderByDueDate: 'asc', withPendingQuantity: true }
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
        quantity: 0,
        dispatchQuantity: 0,
        daysOff,
        colorDaysOff: daysOff < 3 ? 'red' : daysOff < 7 ? 'orange' : 'green',
        labelOptions: selectedOptions.map(i => {
          let label = i.title;
          if (i.parent) label = `[${i.parent.title}] ${i.title}`;
          return `<div class="text-caption text-blue-grey">- ${label}</div>`;
        }).join('')
      };
      const shippedSizes = this.unifyShippedSizes(item.shipmentItems ?? []);
      for (let i = this.sizes.min; i <= this.sizes.max; i++) {
        const itemSize = item?.sizes?.find(s => s.size == i);
        const sizeQuantity = (itemSize ? itemSize.quantity : 0) - (shippedSizes[i] || 0);
        newRow[i] = sizeQuantity;
        newRow[this.getDispatchSizeLabelName(i)] = sizeQuantity;
        newRow.quantity += sizeQuantity;
        newRow.dispatchQuantity += sizeQuantity;
      }

      return newRow;
    },
    unifyShippedSizes(items) {
      const unifiedSizes = {};
      for (const item of items) {
        for (const { size, quantity } of item.sizes) {
          unifiedSizes[size] = (unifiedSizes[size] || 0) + quantity;
        }
      }

      return unifiedSizes;
    },
    getDispatchSizeLabelName(size) {
      return `${size}Dispatch`;
    },
    getSizeColumnValue(row, size) {
      if (!row[size]) return row[size];
      const sizeQuantity = this.$trn(row[size]);
      const dispatchQuantity = this.$trn(row[this.getDispatchSizeLabelName(size)] || 0);
      if (this.programming && sizeQuantity != dispatchQuantity) {
        return `<span class="text-orange">${dispatchQuantity}</span> / ${sizeQuantity}`;
      }
      return sizeQuantity;
    },
    validateDispatchQuantity(value, max) {
      let val = Number(value);
      if (isNaN(val) || val > max) val = max;
      return val;
    },
    setDispatchTotalQuantity(row) {
      const dispatchQuantity = this.sizeRange.reduce((sum, size) => {
        return sum + (Number(row[this.getDispatchSizeLabelName(size)]) || 0);
      }, 0);
      const rowIndex = this.orderItems.findIndex(i => i.id == row.id);
      this.orderItems[rowIndex].dispatchQuantity = dispatchQuantity;
    },
    validateDispatchItem(row) {
      const dispatchQuantity = row.dispatchQuantity;
      let quantityLabel = `<b class="text-blue">${row.quantity}</b>`;
      if (dispatchQuantity != row.quantity)
        quantityLabel = `<b class="text-orange">${dispatchQuantity}</b>/${quantityLabel}`;
      const body = `<div class="text-blue-grey q-mb-md">
        <div><b>Cliente: </b> ${row.order.account.title}</div>
        <div><b>Cantidad: </b>${quantityLabel}</div>
        <div><b>Referencia: </b> ${row.shoe.title}</div>
        <div class="text-caption text-grey q-mt-sm">${row.labelOptions}</div>
        </div>
        `;
      this.confirmProgram = {
        ...this.confirmProgram,
        show: true,
        body, row,
        supplierId: null
      };
    },
    dispatchItem() {
      this.confirmProgram.loading = true;
      const row = this.confirmProgram.row;
      const dispatchQuantity = this.confirmProgram.row.dispatchQuantity;

      const dispatchData = {
        orderItemId: row.id,
        quantity: dispatchQuantity,
        supplierId: this.confirmProgram.supplierId,
        sizes: this.sizeRange.map(size => ({
          size,
          quantity: row[this.getDispatchSizeLabelName(size)] || 0
        }))
      };

      this.$crud.create('apiRoutes.qfulfillment.shipmentItems', dispatchData)
        .then(response => {
          this.$alert.success('Despacho creado exitosamente');
          this.getOrderItems();
        }).catch(error => {
        this.$alert.error('Error al crear el despacho');
      }).finally(() => {
        this.confirmProgram.show = false;
        this.confirmProgram.loading = false
      });
    }
  }
};
</script>
<style lang="stylus">
</style>
