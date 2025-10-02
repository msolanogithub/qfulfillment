<template>
  <div id="shipmentsIfulfillment" class="relative-position">
    <page-actions
      :title="$tr($route.meta.title)"
      class="q-mb-md" @refresh="getShipments" />
    <!-- New shipment -->
    <q-expansion-item
      class="box box-auto-height q-mb-md"
      icon="fa-light fa-truck-fast"
      label="Nuevo Despacho"
      header-class="text-blue"
    >
      <div class="q-pa-md relltive-position">
        <div class="q-mb-md text-info">
          <q-icon name="fa-light fa-circle-info" size="sm" class="q-mr-md" />
          Seleccione un cliente para ver sus pedidos pendientes de despacho.
        </div>
        <!-- Filter Client -->
        <dynamic-field
          v-model="formShipment.accountId"
          :field="dynamicFields.accountId"
          @update:modelValue="getShipmentItems"
        />
        <dynamic-field
          v-model="formShipment.shippedAt"
          :field="dynamicFields.date"
        />
        <dynamic-field
          v-model="formShipment.comments"
          :field="dynamicFields.comment"
        />
        <!-- ShippemntItems -->
        <div v-if="shipmentItems.length">
          <div class="q-mb-md text-info q-mt-md">
            <q-icon name="fa-light fa-circle-info" size="sm" class="q-mr-md" />
            Esta lista tiene todas las referencias pendientes de despacho de este cliente.
            Remueve de la lista las referencias que no necesites despachar.
            Las referencias que remuevas podras agregarlas en un proximo despacho
          </div>
          <q-table
            flat bordered separator="cell"
            :rows="newItems.items"
            :columns="columns"
            row-key="id"
            hide-pagination
            :pagination="pagination"
          >
            <template v-slot:body-cell="props">
              <q-td :props="props">
                <!-- dueDate -->
                <div v-if="props.col.name == 'dueDate'">
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
                <!-- locatable -->
                <div v-else-if="props.col.name == 'locatable'">
                  {{ props.value.city.name }}
                  <div
                    class="text-caption text-grey ellipsis"
                    style="max-width: 200px"
                  >
                    {{ props.value.address }}
                    <q-tooltip>{{ props.value.address }}</q-tooltip>
                  </div>
                </div>
                <!-- Totales -->
                <div v-else-if="props.col.name == 'total'">
                  <q-btn
                    unelevated rounded no-caps
                    color="red-5"
                    @click="removeShipmentItem(props.row, props.rowIndex)"
                  >
                    <div class=" row items-center">
                      <q-icon name="fa-light fa-trash-xmark" size="16px" class="q-mr-sm" />
                      {{ $trn(props.value) }}
                    </div>
                    Remover
                  </q-btn>
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
                  :class="newItems.totals.bySize[size] ? 'text-blue' : 'text-blue-grey'"
                >
                  {{ $trn(newItems.totals.bySize[size]) }}
                </q-td>
                <!-- Total general -->
                <q-td class="text-center text-blue text-bold">
                  {{ $trn(newItems.totals.grand) }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <!-- Actions -->
          <div class="text-right q-mt-md">
            <q-btn unelevated rounded color="green" label="Crear Despacho"
                   no-caps :disable="!formShipment.shippedAt" @click="createShipment" />
          </div>
        </div>
        <!-- Loaaoding -->
        <inner-loading :visible="loadingCreation" />
      </div>
    </q-expansion-item>

    <!-- Shipments  -->
    <template v-for="(shipment, index) in shipmentsMapped" :key="shipment.id">
      <q-expansion-item
        class="box box-auto-height q-mb-md"
        icon="fa-light fa-truck-fast"
        header-class="text-blue-grey"
        :label="shipment.account.title"
        :caption="shipment.caption"
      >
        <div v-if="shipment.comments" class="q-my-md text-info">
          <q-icon name="fa-light fa-comment-dots" size="16px" class="q-mr-sm" />
          {{shipment.comments}}
        </div>
        <q-table
          flat bordered separator="cell"
          :rows="shipment.items"
          :columns="columnsShipments"
          row-key="id"
          hide-pagination
          :pagination="pagination"
        >
          <template v-slot:body-cell="props">
            <q-td :props="props">
              <!-- dueDate -->
              <div v-if="props.col.name == 'dueDate'">
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
              <!-- Programming Date -->
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
                :class="shipment.totals.bySize[size] ? 'text-blue' : 'text-blue-grey'"
              >
                {{ $trn(shipment.totals.bySize[size]) }}
              </q-td>
              <!-- Total general -->
              <q-td class="text-center text-blue text-bold">
                {{ $trn(shipment.totals.grand) }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-expansion-item>
    </template>

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
      loadingCreation: false,
      shipments: [],
      shipmentItems: [],
      sizes: { min: 33, max: 46 },
      pagination: {
        page: 1,
        rowsPerPage: 0
      },
      formShipment: {
        accountId: null,
        shippedAt: null,
        comments: null
      }
    };
  },
  computed: {
    dynamicFields() {
      return {
        accountId: {
          type: 'select',
          props: {
            label: 'Cliente *'
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
        },
        date: {
          type: 'date',
          props: {
            label: 'Fecha de envio *',
            hint: ''
          }
        },
        comment: {
          value: '',
          type: 'input',
          props: {
            label: 'Observaciones',
            type: 'textarea',
            rows: '3'
          }
        }
      };
    },
    columns() {
      let columns = [
        {
          name: 'id',
          label: 'Orden ID',
          field: 'orderItem',
          align: 'center',
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
        },
        {
          name: 'locatable',
          label: 'Dirección de envio',
          field: 'orderItem',
          align: 'left',
          format: val => val.order.locatable
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
    columnsShipments() {
      let columns = [
        {
          name: 'id',
          label: 'Orden ID',
          field: 'orderItem',
          align: 'center',
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
        },
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
    newItems() {
      const items = this.shipmentItems.map(item => this.mapBaseShipmentItem(item));
      const totals = this.calcSizeTotals(items);
      return { items, totals };
    },
    shipmentsMapped() {
      const mapped = this.shipments.map(s => {
        const items = s.items.map(i => this.mapBaseShipmentItem(i));
        return {
          ...s,
          items,
          caption: `${s.totalItems} Pares | ${this.$trd(s.shippedAt, { type: 'small' })}`,
          totals: this.calcSizeTotals(items)
        }
      });

      return mapped;
    }
  },
  methods: {
    init() {
      this.getShipments();
    },
    //Get data
    getShipments() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        //Requets params
        let requestParams = {
          refresh: true,
          params: {
            order: { field: 'shipped_at', way: 'asc' },
            include: 'items.orderItem.shoe.translations,items.orderItem.order,account'
          }
        };
        //Request
        this.$crud.index('apiRoutes.qfulfillment.shipments', requestParams).then(response => {
          this.shipments = response.data;
          this.loading = false;
        }).catch(error => {
          this.loading = false;
        });
      });
    },
    getShipmentItems(accountId) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        //Requets params
        let requestParams = {
          refresh: true,
          params: {
            include: 'orderItem.order.account,orderItem.shoe.translations,orderItem.order.locatable.city.translations',
            filter: { shipmentId: { where: 'null' }, accountId },
            order: { field: 'created_at', way: 'asc' }
          }
        };
        //Request
        this.$crud.index('apiRoutes.qfulfillment.shipmentItems', requestParams).then(response => {
          this.shipmentItems = response.data;
          this.loading = false;
        }).catch(error => {
          this.loading = false;
        });
      });
    },
    mapBaseShipmentItem(item = null) {
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
    },
    calcSizeTotals(shipmentItems) {
      const totals = {};
      this.sizeRange.forEach(size => (totals[size] = 0));
      let grand = 0;
      shipmentItems.forEach(row => {
        this.sizeRange.forEach(size => {
          const v = Number(row[size] || 0);
          totals[size] += v;
          grand += v;
        });
      });

      return { bySize: totals, grand };
    },
    removeShipmentItem(row, index) {
      this.$alert.error({
        mode: 'modal',
        title: 'Remover está referencia',
        message: `<div class="text-blue-grey">
        <div><b>Cliente: </b>${row.orderItem.order.account.title}</div>
        <div><b>Direccion de Envio: </b>
          ${row.orderItem.order.locatable.address}
          (${row.orderItem.order.locatable.city.name})
        </div>
        <div><b>Cantidad: </b>${row.quantity}</div>
        <div><b>Referencia: </b> ${row.orderItem.shoe.title}</div>
        <div class="text-caption text-grey q-mt-sm">${row.labelOptions}</div>
        </div>
        `,
        actions: [
          { label: 'Cancelar', color: 'grey' },
          {
            label: 'Remover',
            color: 'negative',
            handler: () => this.shipmentItems.splice(index, 1)
          }
        ]
      });
    },
    createShipment() {
      const account = this.shipmentItems[0].orderItem.order.account.title;
      const references = this.shipmentItems.map(i => i.orderItem.shoe.title).join(', ');
      this.$alert.info({
        mode: 'modal',
        title: 'Crear Despacho',
        message: `<div class="text-blue-grey">
        <div><b>Cliente: </b> ${account}</div>
        <div><b>Cantidad: </b>${this.newItems.totals.grand} Pares</div>
        <div><b>Referencias: </b> ${references}</div>
        </div>
        `,
        actions: [
          { label: 'Cancelar', color: 'grey' },
          {
            label: 'Crear Despacho',
            color: 'blue',
            handler: () => {
              this.loadingCreation = true;
              const requestParams = {
                accountId: this.formShipment.accountId,
                shippedAt: this.formShipment.shippedAt,
                comments: this.formShipment.comments,
                totalItems: this.newItems.totals.grand,
                items: this.shipmentItems.map(i => i.id)
              };
              this.$crud.create('apiRoutes.qfulfillment.shipments', requestParams).then(response => {
                this.$alert.info({ message: `${this.$tr('isite.cms.message.recordCreated')}` });
                this.loadingCreation = false;
                this.formShipment = { accountId: null, shippedAt: null, comments: null };
                this.shipmentItems = [];
                this.getShipments();
              }).catch(err => {
                this.$alert.error({ message: `${this.$tr('isite.cms.message.recordNoCreated')}` });
              }).finally(() => {
                this.loading = false;
              });
            }
          }
        ]
      });
    }
  }
};
</script>
<style lang="stylus">
</style>
