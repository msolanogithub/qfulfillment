<template>
  <div id="shipmentsIfulfillment" class="relative-position">
    <page-actions
      :title="$tr($route.meta.title)"
      class="q-mb-md" @refresh="getShipments" />

    <div class="box box-auto-height q-mb-md">
      <div class="box-title q-mb-md row justify-between items-center">
        <div>
          <q-icon name="fa-light fa-filter" class="q-mr-sm" />
          Filtros
        </div>
        <q-toggle
          v-model="showHistory"
          label="Ver Enviados"
          color="blue"
          @update:modelValue="getShipments"
        />
      </div>
      <div class="row q-col-gutter-md">
        <div class="col">
          <dynamic-field
            v-model="filterData.accountId"
            :field="dynamicFields.accountShipments"
            @update:modelValue="getShipments"
          />
        </div>
        <div class="col">
          <dynamic-field
            v-model="filterData.cityId"
            :field="dynamicFields.cityShipments"
            @update:modelValue="getShipments"
          />
        </div>
        <div class="col" v-if="showHistory">
          <dynamic-field
            v-model="filterData.shippedAt"
            :field="dynamicFields.date"
            @update:modelValue="getShipments"
          />
        </div>
      </div>
      <div class="q-mb-md text-info">
        <q-icon name="fa-light fa-circle-info" size="sm" class="q-mr-md" />
        Aqui puedes administrar los despachos de tus clientes.
        Puedes ver los pedidos pendientes de despacho con un color naranja y los despachos que ya fueron enviados con un
        color verde.
      </div>
    </div>

    <!-- New shipment -->
    <q-expansion-item
      v-if="!showHistory"
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
            :field="dynamicFields.accountShipmentItems"
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
          <div class="row q-col-gutter-md">
            <dynamic-field
              v-model="formShipment.unitsPerPackage"
              :field="dynamicFields.unitsPerPackage"
              class="col"
            />
            <dynamic-field
              v-model="formShipment.packagedBy"
              :field="dynamicFields.packagedBy"
              class="col"
            />
            <dynamic-field
              v-model="formShipment.shippedWith"
              :field="dynamicFields.shippedWith"
              class="col"
            />
            <dynamic-field
              v-model="formShipment.comments"
              :field="dynamicFields.comment"
              class="col-12"
            />
          </div>
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
                     :disable="!formShipment.accountId  || !formShipment.locatableId || !formShipment.unitsPerPackage"
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
      <q-expansion-item
        switch-toggle-side
        class="box box-auto-height q-mb-md"
        expand-icon-class="q-pr-none text-blue-grey"
        header-style="border-radius: 10px; padding: 15px"
        :header-class="shipment.stageId == 1 ? 'bg-green-1' : 'bg-orange-1'"
      >
        <template v-slot:header>
          <div class="row q-col-gutter-sm items-center full-width">
            <div class="col text-lowercase">
              <div>
                <q-icon
                  color="blue-grey"
                  class="q-mr-sm"
                  size="sm"
                  name="fa-light fa-map-location-dot"
                />
                <b>{{ shipment.locatable.city.title }}</b> | {{ shipment.locatable.title }}
              </div>
              <div class="text-caption text-grey">
                {{ shipment.locatable.address }}
              </div>
            </div>
            <div class="col text-center">
              <q-icon color="info" size="sm" name="fa-light fa-user" />
              <div class="text-bold">{{ shipment.account.title }}</div>
            </div>
            <div class="col text-right q-pr-md">
              <div>
                <q-icon
                  name="fa-regular fa-box-taped"
                  size="sm"
                  class="q-mr-sm"
                  color="blue-grey"
                />
                {{ $trn(shipment.totalItems) }} Pares
              </div>
              <div class="text-caption text-grey">{{ shipment.packagesLabel }}</div>
            </div>
          </div>

          <div class="row no-wrap items-center q-ml-sm" @click.stop>
            <q-btn
              color="blue-grey"
              icon="fa-light fa-ellipsis-vertical"
              rounded dense outline
            >
              <q-menu>
                <q-list style="min-width: 100px" separator>
                  <q-item clickable v-close-popup @click.native="openShipmentPackages(shipment)">
                    <q-item-section avatar>
                      <q-icon name="fa-light fa-box-open" size="20px" color="info" />
                    </q-item-section>
                    <q-item-section class="text-blue-grey">
                      Ver Rotulos
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="shipment.stageId == 0"
                    clickable
                    v-close-popup
                    @click.native="validateMarkAsShipped(shipment)">
                    <q-item-section avatar>
                      <q-icon name="fa-light fa-box-check" size="20px" color="green" />
                    </q-item-section>
                    <q-item-section class="text-blue-grey">
                      Marcar Como Enviado
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="shipment.stageId == 0"
                    clickable
                    v-close-popup
                    @click="deleteShipment(shipment)">
                    <q-item-section class="text-red-3 text-center">Eliminar</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </template>

        <!--Content-->
        <div class="q-pa-md">
          <div class="q-mb-sm text-blue-grey">
            <q-icon name="fa-light fa-person-dolly" size="18px" class="q-mr-sm" />
            <b>Encargado de Despacho:</b> {{ shipment.options.packagedBy ?? '-' }}
          </div>
          <div class="q-mb-sm text-blue-grey">
            <q-icon name="fa-light fa-truck-ramp-box" size="18px" class="q-mr-sm" />
            <b>Despachado Con:</b> {{ shipment.options.shippedWith ?? '-' }}
          </div>
          <div class="text-blue-grey">
            <q-icon name="fa-light fa-comment-dots" size="18px" class="q-mr-sm" />
            <b>Comentarios:</b> {{ shipment.comments ?? '-' }}
          </div>
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
              <div v-else-if="props.col.name == 'supplier'">
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

    <master-modal
      v-model="confirmShipment.show"
      title="Confirmar Despacho Enviado"
      icon="fa-light fa-box-check">
      <div class="relative-position">
        <div v-html="confirmShipment.body" />
        <dynamic-field
          v-model="confirmShipment.packagedBy"
          :field="dynamicFields.packagedBy"
          class="q-my-md"
        />
        <dynamic-field
          v-model="confirmShipment.shippedWith"
          :field="dynamicFields.shippedWith"
          class="q-my-md"
        />
        <dynamic-field
          v-model="confirmShipment.shippedAt"
          :field="dynamicFields.date"
          class="q-my-md"
        />
        <div class="row justify-end q-gutter-sm">
          <q-btn
            rounded no-caps unelevated
            label="Cancel"
            color="grey"
            @click="confirmShipment.show = false"
          />
          <q-btn
            rounded no-caps unelevated
            label="Completar"
            :disabled="!confirmShipment.shippedAt || !confirmShipment.packagedBy || !confirmShipment.shippedWith"
            color="green"
            @click="markAsShipped"
          />
        </div>
        <inner-loading :visible="confirmShipment.loading" />
      </div>
    </master-modal>

    <div v-if="!shipments.length" class="text-center text-grey-8 q-pa-md">
      No hay despachos registrados...
    </div>

    <inner-loading :visible="loading" />
  </div>
</template>
<script>
import { tdOrderId, tdDueDate, tdShoe } from 'modules/qfulfillment/_components/tdTable';
import { usePDF } from 'vue3-pdfmake';
import { generateShipmentPdf } from 'modules/qfulfillment/_plugins/shipment-boxes-pdf';

export default {
  setup() {
    const pdfmake = usePDF({ autoInstallVFS: true });
    return { pdfmake };
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
      filterData: {
        accountId: null,
        cityId: null,
        shippedAt: this.$moment().format('YYYY-MM-DD')
      },
      formShipment: {
        accountId: null,
        locatableId: null,
        unitsPerPackage: null,
        comments: null,
        shippedWith: null,
        packagedBy: null
      },
      confirmShipment: {
        show: false,
        row: null,
        body: null,
        shippedAt: null,
        packagedBy: null,
        shippedWith: null,
        loading: false
      },
      showHistory: false
    };
  },
  computed: {
    dynamicFields() {
      return {
        accountShipments: {
          type: 'select',
          props: {
            label: 'Cliente',
            clearable: true
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qfulfillment.shipmentsGroupData',
            requestParams: { filter: { getUniqueAccounts: true } },
            select: {
              label: row => row.title,
              id: row => row.id
            }
          }
        },
        cityShipments: {
          type: 'select',
          props: {
            label: 'Ciudad',
            clearable: true
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qfulfillment.shipmentsGroupData',
            requestParams: { filter: { getUniqueCities: true } },
            select: {
              label: row => row.title,
              id: row => row.id
            }
          }
        },
        accountShipmentItems: {
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
        shippedWith: {
          type: 'input',
          props: {
            label: 'Despachado Con *'
          }
        },
        packagedBy: {
          type: 'input',
          props: {
            label: 'Encargado de Despacho *'
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
            order: { field: 'id', way: 'desc' },
            filter: {},
            include: [
              'items.orderItem.shoe.translations',
              'items.orderItem.shoe.options',
              'items.orderItem.order',
              'locatable.translations',
              'locatable.city.translations',
              'locatable.country.translations',
              'locatable.province.translations',
              'account.contactItems.translations'
            ].join(',')
          }
        };
        //add filters
        if (this.filterData.accountId) requestParams.params.filter.accountId = this.filterData.accountId;
        if (this.filterData.cityId) requestParams.params.filter.cityId = this.filterData.cityId;
        if (this.showHistory) requestParams.params.filter.shippedAt = this.filterData.shippedAt;
        requestParams.params.filter.stageId = this.showHistory ? 1 : 0;
        //Request
        this.$crud.index('apiRoutes.qfulfillment.shipments', requestParams).then(response => {
          this.shipments = response.data;
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
                locatableId: this.formShipment.locatableId,
                comments: this.formShipment.comments,
                totalItems: this.newItems.totals.grand,
                items: this.shipmentItems.map(i => i.id),
                unitsPerPackage: this.formShipment.unitsPerPackage,
                packagesTotal,
                options: { shippedWith: this.formShipment.shippedWith, packagedBy: this.formShipment.packagedBy }
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
    },
    validateMarkAsShipped(row) {
      const body = `<div class="text-blue-grey">
        <div><b>Cliente: </b>${row.account.title}</div>
        <div><b>Cantidad: </b>${row.totalItems} Pares</div>
        <div><b>Embalaje: </b>${row.packagesLabel}</div>
        <div><b>Direccion de Envio: </b>
          ${row.locatable.address}
          (${row.locatable.city.title})
        </div>
        </div>
        `;
      this.confirmShipment = {
        show: true, loading: false,
        body, row, shippedAt: this.$moment().format('YYYY-MM-DD'),
        packagedBy: row.options.packagedBy,
        shippedWith: row.options.shippedWith
      };
    },
    markAsShipped() {
      this.confirmShipment.loading = true;
      this.$crud.update(
        'apiRoutes.qfulfillment.shipments', this.confirmShipment.row.id,
        {
          shippedAt: this.confirmShipment.shippedAt,
          stageId: 1,
          options: {
            packagedBy: this.confirmShipment.packagedBy,
            shippedWith: this.confirmShipment.shippedWith
          }
        }
      ).then(response => {
        this.$alert.info({ message: `${this.$tr('isite.cms.message.recordUpdated')}` });
        this.getShipments();
        this.confirmShipment.loading = false;
        this.confirmShipment.show = false;
      }).catch(err => {
        this.$alert.error({ message: `${this.$tr('isite.cms.message.recordNoUpdated')}` });
      }).finally(() => {
        this.confirmShipment.loading = false;
      });
    },
    deleteShipment(row) {
      this.$alert.error({
        mode: 'modal',
        title: `Eliminar Despacho #${row.id}`,
        message: `<div class="text-blue-grey">
        <div><b>Cliente: </b>${row.account.title}</div>
        <div><b>Direccion de Envio: </b>
          ${row.locatable.address}
          (${row.locatable.city.title})
        </div>
        <div><b>Cantidad: </b>${row.totalItems} Pares</div>

        <b class="text-negative q-mt-sm">
        ¿Estas seguro que quiere eliminar este despacho?
        </b>
        </div>
        `,
        actions: [
          { label: 'Cancelar', color: 'grey' },
          {
            label: 'Eliminar',
            color: 'negative',
            handler: () => {
              this.loading = true;
              this.$crud.delete('apiRoutes.qfulfillment.shipments', row.id).then(response => {
                this.$alert.info({ message: `${this.$tr('isite.cms.message.recordDeleted')}` });
                this.getShipments();
                this.loading = false;
              }).catch(err => {
                this.$alert.error({ message: `${this.$tr('isite.cms.message.recordNoDeleted')}` });
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
