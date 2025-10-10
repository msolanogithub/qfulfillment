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
        <div class="row q-gutter-md">
          <dynamic-field
            v-model="formShipment.accountId"
            :field="dynamicFields.accountId"
            class="col"
            @update:modelValue="val => {
            formShipment.locatableId = null;
            getShipmentItems()
          }"
          />
          <dynamic-field
            v-model="formShipment.locatableId"
            :field="dynamicFields.locatableId"
            class="col"
            @update:modelValue="getShipmentItems"
          />
        </div>
        <div v-if="shipmentItems.length">
          <div class="row q-gutter-md">
            <dynamic-field
              v-model="formShipment.unitsPerPackage"
              :field="dynamicFields.unitsPerPackage"
              class="col"
            />
            <dynamic-field
              v-model="formShipment.shippedAt"
              :field="dynamicFields.date"
              class="col"
            />
          </div>
          <dynamic-field
            v-model="formShipment.comments"
            :field="dynamicFields.comment"
          />
          <!-- ShippemntItems -->
          <div>
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
              <template v-slot:body-cell-id="props">
                <td-order-id :order="props.value" />
              </template>
              <template v-slot:body-cell-dueDate="props">
                <td-due-date :order="props.value" />
              </template>
              <template v-slot:body-cell-shoe="props">
                <td-shoe :shoe="props.value.shoe" :selected-options="props.value.options" />
              </template>

              <template v-slot:body-cell="props">
                <q-td :props="props">
                  <!-- createdAt -->
                  <div v-if="props.col.name == 'createdAt'">
                    {{ props.value }}
                    <div class="text-caption text-grey">
                      {{ props.row.daysFromCreation }} Días Transcurridos
                    </div>
                  </div>
                  <!-- supplier -->
                  <div v-else-if="props.col.name == 'supplier'" class="cursor-pointer">
                    <div class="row items-center no-wrap">
                      <div class="q-mr-sm">
                        <q-icon
                          :name="props.value.icon"
                          size="sm" :color="props.row.stage.color"
                          class="q-mr-sm"
                        />
                      </div>
                      <div>
                        {{ props.value.title }}
                        <div :class="`text-caption text-${props.row.stage.color}`">
                          {{ props.row.stage.title }}
                        </div>
                      </div>
                    </div>
                    <q-popup-edit
                      v-model="props.row.name"
                      @before-show="row => {
                  form.stageId = props.row.stageId;
                  form.supplierId = props.row.supplierId
                }">
                      <div class="q-mb-md">
                        <div class="text-blue-grey"><b>Orden:</b> {{ props.row.orderItem.id }}</div>
                        <div class="text-blue-grey"><b>Cliente:</b> {{ props.row.orderItem.order.account.title }}</div>
                        <div class="text-blue-grey"><b>Referencia:</b> {{ props.row.orderItem.shoe.title }}</div>
                      </div>
                      <dynamic-field v-model="form.supplierId" :field="dynamicFields.supplierId" />
                      <dynamic-field v-model="form.stageId" :field="dynamicFields.stageId" />
                      <!-- Actions -->
                      <div class="q-mt-md row justify-end q-gutter-sm">
                        <q-btn
                          unelevated rounded no-caps
                          label="Cancelar"
                          color="grey"
                          v-close-popup
                        />
                        <q-btn
                          unelevated rounded no-caps
                          label="Actualizar"
                          color="green"
                          v-close-popup
                          @click="updateItem(props.row, props.rowIndex)"
                        />
                      </div>
                    </q-popup-edit>
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
                     :disable="!formShipment.shippedAt || !formShipment.unitsPerPackage"
                     no-caps @click="createShipment" />
            </div>
          </div>
        </div>
        <div
          v-else-if="formShipment.accountId && formShipment.locatableId"
          class="text-orange text-center"
        >
          <q-icon name="fa-light fa-circle-exclamation" size="sm" class="q-mr-md" />
          Este Cliente no tiene referencias listas para despachos...
        </div>
        <!-- Loaaoding -->
        <inner-loading :visible="loadingCreation" />
      </div>
    </q-expansion-item>

    <!-- Shipments  -->
    <template v-for="(shipment, index) in shipmentsMapped" :key="shipment.id">
      <q-expansion-item class="box box-auto-height q-mb-md">
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon color="blue-grey" name="fa-light fa-truck-fast" />
          </q-item-section>

          <q-item-section class="text-blue-grey">
            <div class="row items-center">
              <div class="col">
                <span>
                  <b>{{ shipment.locatable.city.title }}</b> |
                  {{ shipment.locatable.title }}
                </span>
                <div class="text-caption text-grey">
                  {{ shipment.locatable.address }}
                </div>
              </div>
              <div class="col">
                <span><b>{{ shipment.id }}</b> | {{ shipment.account.title }}</span>
                <div class="text-caption text-grey">
                  {{ shipment.caption }}
                </div>
              </div>
            </div>
          </q-item-section>

          <q-item-section side @click.stop class="text-center text-blue-grey">
            <q-btn
              unelevated rounded no-caps
              color="info"
              @click.stop="openShipmentPackages(shipment)"
            >
              <div>
                <div class="row items-center justify-center">
                  <q-icon name="fa-regular fa-box-taped" size="18px" class="q-mr-sm" />
                  <b>Embalaje</b>
                </div>
                <div>{{ shipment.packagesLabel }}</div>
              </div>
              <q-tooltip>Ver Rotulos de envio</q-tooltip>
            </q-btn>
          </q-item-section>
        </template>

        <!--Content-->
        <div v-if="shipment.comments" class="q-my-md text-info">
          <q-icon name="fa-light fa-comment-dots" size="16px" class="q-mr-sm" />
          {{ shipment.comments }}
        </div>
        <q-table
          flat bordered separator="cell"
          :rows="shipment.items"
          :columns="columns"
          row-key="id"
          hide-pagination
          :pagination="pagination"
        >

          <template v-slot:body-cell-id="props">
            <td-order-id :order="props.value" />
          </template>

          <template v-slot:body-cell-dueDate="props">
            <td-due-date :order="props.value" />
          </template>

          <template v-slot:body-cell-shoe="props">
            <td-shoe :shoe="props.value.shoe" :selected-options="props.value.options" />
          </template>

          <template v-slot:body-cell="props">
            <q-td :props="props">
              <div v-if="props.col.name == 'createdAt'">
                {{ props.value }}
                <div class="text-caption text-grey">
                  {{ props.row.daysFromCreation }} Días Transcurridos
                </div>
              </div>
              <div v-else-if="props.col.name == 'supplier'" class="cursor-pointer">
                <div class="row items-center no-wrap">
                  <div class="q-mr-sm">
                    <q-icon
                      :name="props.value.icon"
                      size="sm" :color="props.row.stage.color"
                      class="q-mr-sm"
                    />
                  </div>
                  <div>
                    {{ props.value.title }}
                    <div :class="`text-caption text-${props.row.stage.color}`">
                      {{ props.row.stage.title }}
                    </div>
                  </div>
                </div>
                <q-popup-edit
                  v-model="props.row.name"
                  @before-show="row => {
                  form.stageId = props.row.stageId;
                  form.supplierId = props.row.supplierId
                }">
                  <div class="q-mb-md">
                    <div class="text-blue-grey"><b>Orden:</b> {{ props.row.orderItem.id }}</div>
                    <div class="text-blue-grey"><b>Cliente:</b> {{ props.row.orderItem.order.account.title }}</div>
                    <div class="text-blue-grey"><b>Referencia:</b> {{ props.row.orderItem.shoe.title }}</div>
                  </div>
                  <dynamic-field v-model="form.supplierId" :field="dynamicFields.supplierId" />
                  <dynamic-field v-model="form.stageId" :field="dynamicFields.stageId" />
                  <!-- Actions -->
                  <div class="q-mt-md row justify-end q-gutter-sm">
                    <q-btn
                      unelevated rounded no-caps
                      label="Cancelar"
                      color="grey"
                      v-close-popup
                    />
                    <q-btn
                      unelevated rounded no-caps
                      label="Actualizar"
                      color="green"
                      v-close-popup
                      @click="updateItem(props.row, props.rowIndex)"
                    />
                  </div>
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
import { tdOrderId, tdDueDate, tdShoe } from 'modules/qfulfillment/_components/tdTable';
import { usePDF } from 'vue3-pdfmake'
import { generateShipmentPdf } from 'modules/qfulfillment/_plugins/shipment-boxes-pdf';

export default {
  setup(){
    const pdfmake = usePDF({ autoInstallVFS: true })
    return { pdfmake }
  },
  props: {},
  components: { tdOrderId, tdDueDate, tdShoe },
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
        locatableId: null,
        unitsPerPackage: null,
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
        locatableId: {
          type: 'select',
          props: {
            label: 'Dirección de Envio *',
            disable: !this.formShipment.accountId
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qfulfillment.shipmentItemsGroupData',
            requestParams: { filter: { locatationsByAccount: this.formShipment.accountId } },
            select: {
              label: row => `${row.city} | ${row.title}`,
              sublabel: row => row.address,
              id: row => row.id
            }
          }
        },
        unitsPerPackage: {
          type: 'input',
          props: {
            label: 'Unidades por paquete *',
            tye: 'numer',
            min: 1
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
          label: 'Orden',
          field: 'orderItem',
          align: 'center',
          format: val => val.order
        },
        {
          name: 'dueDate',
          label: this.$tr('ifulfillment.cms.dueDate'),
          field: 'orderItem',
          align: 'left',
          format: val => val.order
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
          align: 'center'
        },
        {
          name: 'supplier',
          label: 'Proveedor',
          field: 'supplier',
          align: 'center'
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
          packagesLabel: `${s.packagesTotal} Paquetes x ${s.unitsPerPackage} Pares`,
          totals: this.calcSizeTotals(items)
        };
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
            include: [
              'items.orderItem.shoe.translations',
              'items.orderItem.shoe.options',
              'items.orderItem.order.locatable.translations',
              'items.orderItem.order.locatable.city.translations',
              'items.orderItem.order.locatable.country.translations',
              'items.orderItem.order.locatable.province.translations',
              'account.contactItems.translations'
            ].join(',')
          }
        };
        //Request
        this.$crud.index('apiRoutes.qfulfillment.shipments', requestParams).then(response => {
          this.shipments = response.data.map(i => ({
            ...i,
            locatable: i.items[0].orderItem.order.locatable
          }));
          this.loading = false;
        }).catch(error => {
          this.loading = false;
        });
      });
    },
    getShipmentItems() {
      return new Promise((resolve, reject) => {
        const { accountId, locatableId } = this.formShipment;
        if (!accountId || !locatableId) return resolve();
        this.shipmentItems = [];
        this.loading = true;
        //Requets params
        let requestParams = {
          refresh: true,
          params: {
            include: [
              'orderItem.order.account',
              'orderItem.shoe.translations',
              'orderItem.shoe.options',
              'orderItem.order.locatable.city.translations'
            ].join(','),
            filter: {
              shippingId: { where: 'null' },
              stageId: 1, accountId, locatableId
            },
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
          (${row.orderItem.order.locatable.city.title})
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
      const totalUnits = this.newItems.totals.grand;
      const packagesTotal = Math.ceil(totalUnits / this.formShipment.unitsPerPackage);
      this.$alert.info({
        mode: 'modal',
        title: 'Crear Despacho',
        message: `<div class="text-blue-grey">
        <div><b>Cliente: </b> ${account}</div>
        <div><b>Total Pares: </b>${totalUnits} Pares</div>
        <div><b>Referencias: </b> ${references}</div>
        <div><b>Embalaje: </b>${packagesTotal} Paquetes x ${this.formShipment.unitsPerPackage} Pares</div>
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
                items: this.shipmentItems.map(i => i.id),
                unitsPerPackage: this.formShipment.unitsPerPackage,
                packagesTotal
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
    },
    openShipmentPackages(row) {
      generateShipmentPdf(this.pdfmake, row);
    }
  }
};
</script>
<style lang="stylus">
</style>
