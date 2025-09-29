<template>
  <div id="formOrder" class="relative-position">
    <page-actions
      :title="$tr($route.meta.title) + (orderId ? ' #' + orderId : '')"
      class="q-mb-md"
      @refresh="init"
    />

    <div class="row q-col-gutter-md">
      <div class="col-8">
        <div class="box">
          <div class="box-title q-mb-md">
            <q-icon name="fa-light fa-user" class="q-mr-sm" />
            Información
          </div>
          <dynamic-field v-model="form.accountId" :field="dynamicFields.accountId" />
          <dynamic-field v-model="form.locatableId" :field="dynamicFields.locatableId" />
          <dynamic-field v-model="form.dueDate" :field="dynamicFields.dueDate" />
          <dynamic-field v-model="form.externalId" :field="dynamicFields.externalId" class="q-mb-md" />
          <dynamic-field v-model="form.comment" :field="dynamicFields.comment" class="q-mb-md" />
        </div>
      </div>
      <div class="col-4">
        <div class="box">
          <dynamic-field
            v-model="form.mediasSingle"
            :field="dynamicFields.mediasSingle"
            :item-id="orderId"
          />
        </div>
      </div>
      <div class="col-12">
        <div class="box">
          <div class="box-title q-mb-md row justify-between items-center">
            <div>
              <q-icon name="fa-light fa-boot" class="q-mr-sm" />
              Referencias
            </div>
            <div>
              <q-chip size="12px" class="text-blue-grey bg-grey-2">
                <q-avatar color="info" text-color="white">
                  {{ totals.totalPairs }}
                </q-avatar>
                Pares Totales
              </q-chip>
              <q-chip size="12px" class="text-blue-grey bg-grey-2">
                <q-avatar color="info" text-color="white">
                  {{ totals.totalReferences }}
                </q-avatar>
                Referencias
              </q-chip>
            </div>
          </div>
          <q-table
            flat bordered separator="cell"
            :rows="form.rows"
            :columns="columns"
            row-key="id"
            hide-pagination
            :pagination="pagination"
          >
            <!-- Columns -->
            <template v-slot:body-cell="props">
              <q-td :props="props">
                <!-- Referencia -->
                <div v-if="props.col.name == 'reference'">
                  <div class="row items-center no-wrap">
                    <div class="q-mr-sm">
                      <help-text
                        :title="props.row[props.col.name].title"
                        :description="props.row.labelOptions"
                      />
                    </div>
                    <div>
                      {{ props.row[props.col.name].title }} <br>
                      <span class="text-caption text-grey">
                      {{ props.row.options.length }} Opciones
                    </span>
                    </div>
                  </div>
                </div>
                <!-- total calculado -->
                <div v-else-if="props.col.name === 'total'" class="text-right">
                  {{ rowTotal(props.row) }}
                </div>
                <!-- quantities -->
                <div v-else class="cursor-pointer">
                  <div :class="props.row[props.col.name] ? 'text-blue text-bold' : 'text-blue-grey'">
                    {{ props.row[props.col.name] }}
                  </div>
                  <q-popup-edit
                    v-model="props.row[ props.col.name ]"
                    color="blue-grey"
                    v-slot="scope"
                  >
                    <div class="text-blue-grey q-mb-sm">
                      {{ props.row.reference.title }}
                    </div>
                    <q-input
                      v-model="scope.value"
                      color="blue-grey"
                      :label="'Talla: '+props.col.name"
                      outlined autofocus
                      @keyup.enter="() => {
                        scope.value = normalizeQty(scope.value)
                        scope.set()
                      }"
                      type="number"
                      inputmode="numeric"
                      min="0" step="1"
                      hint="Presiona Enter para guardar"
                    />
                  </q-popup-edit>
                </div>
              </q-td>
            </template>
          </q-table>
          <!-- Save Action -->
          <q-btn
            color="blue"
            outline rounded
            no-caps class="full-width q-mt-md"
            icon="fa-light fa-plus"
            label="Agregar Referencia"
            @click="formAddReference.show = true"
          />
        </div>
      </div>
      <div class="col-12">
        <div class="box">
          <div class="q-mb-md text-info">
            <q-icon name="fa-light fa-circle-info" size="sm" class="q-mr-md" />
            Debes completar todos los campos con un * para crear una orden.
          </div>
          <div v-for="(item, itemKey) in validation.items" :key="itemKey" class="q-pl-lg">
            <q-icon
              :name="item.isValid ? 'fas fa-circle-check' : 'fa-light fa-circle'"
              :color="item.isValid ? 'green' : 'red'"
              class="q-mr-md"
            />
            <span class="text-blue-grey">{{ item.label }}</span>
          </div>
          <q-btn
            color="positive" class="full-width q-mt-lg"
            unelevated rounded no-caps
            :label="orderId ? 'Actualizar Orden' : 'Crear Orden'"
            @click="orderId ? updateOrder() : createOrder()"
            :disable="!validation.allValid"
          />
        </div>
      </div>
    </div>

    <q-dialog v-model="formAddReference.show" persistent>
      <q-card style="max-width: 450px">
        <q-card-section>
          <div class="text-h6">Agregar Referencia</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <dynamic-field
            v-model="formAddReference.shoe"
            :field="dynamicFields.shoe"
            @update:modelValue="value => formAddReference.options = value.options.map(i => i.id)"
          />
          <dynamic-field
            v-model="formAddReference.options"
            :field="dynamicFields.shoeOptions"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            no-caps
            label="Cancelar"
            color="blue-grey"
            v-close-popup
          />
          <q-btn
            unelevated
            rounded
            no-caps
            label="Agregar"
            color="positive"
            :disable="!formAddReference.shoe"
            v-close-popup
            @click="setReference"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
      orderId: this.$route.params.id || null,
      loading: false,
      form: {
        accountId: null,
        locatableId: null,
        dueDate: null,
        externalId: null,
        comment: null,
        mediasSingle: null,
        rows: []
      },
      sizes: { min: 33, max: 46 },
      formAddReference: {
        show: false,
        shoe: null,
        options: []
      },
      loadedShoeOptions: [],
      pagination: {
        page: 1,
        rowsPerPage: 0
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
            apiRoute: 'apiRoutes.qaccount.accounts',
            select: {
              label: 'title',
              id: 'id',
              sublabel: i => `${i.documentType.title}: ${i.document}`
            }
          }
        },
        locatableId: {
          type: 'select',
          props: {
            label: 'Dirección de envio *',
            disable: !this.form.accountId
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qlocations.locatables',
            requestParams: {
              include: 'translations,province.translations,city.translations',
              filter: {
                entityType: 'Modules\\Iaccount\\Models\\Account',
                entityId: this.form.accountId
              }
            },
            select: {
              label: 'title',
              id: 'id',
              sublabel: i => `(${i.city.name}) ${i.address}`
            }
          }
        },
        dueDate: {
          type: 'date',
          props: {
            label: 'Fecha de envio *',
            hint: ''
          }
        },
        externalId: {
          type: 'input',
          props: {
            label: 'ID Orden de Compra'
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
        },
        mediasSingle: {
          type: 'media',
          props: {
            label: 'Documento Soporte *',
            zone: 'mainfile',
            entity: 'Modules\\Ifulfillment\\Models\\Order',
            entityId: null,
            accept: 'images,.pdf',
            directUpload: true
          }
        },
        shoe: {
          type: 'select',
          props: {
            label: 'Referencia',
            emitValue: false
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qshoe.shoes',
            requestParams: {
              include: 'translations,options.translations'
            },
            select: { label: 'title', id: 'id' }
          }
        },
        shoeOptions: {
          type: 'treeSelect',
          props: {
            label: this.$trp('isite.cms.form.option'),
            multiple: true,
            disableBranchNodes: true,
            disable: !this.formAddReference.shoe
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qshoe.options',
            requestParams: { include: 'parent.translations,translations' },
            select: {
              label: (row) => {
                if (row.parent) return `[${row.parent.title}] ${row.title}`;
                return row.title;
              },
              id: 'id'
            },
            loadedOptions: options => this.loadedShoeOptions = options
          }
        }
      };
    },
    columns() {
      let columns = [
        {
          name: 'reference',
          label: 'Referencia',
          field: 'reference',
          align: 'left'
        }
      ];

      for (let i = this.sizes.min; i <= this.sizes.max; i++) {
        columns.push({ name: i, label: i, field: i, align: 'center' });
      }

      columns.push({ name: 'total', label: 'Total', field: 'total', align: 'right' });
      return columns;
    },
    totals() {
      return {
        totalPairs: this.form.rows.reduce((total, i) => total + this.rowTotal(i), 0),
        totalReferences: this.form.rows.length
      };
    },
    validation() {
      const items = {
        accountId: {
          label: 'Selecciona un cliente',
          isValid: !!this.form.accountId
        },
        locatableId: {
          label: 'Selecciona una dirección de envio',
          isValid: !!this.form.locatableId
        },
        dueDate: {
          label: 'Define una fecha de envio',
          isValid: !!this.form.dueDate
        },
        mediasSingle: {
          label: 'Carga el documento soporte',
          isValid: !!this.form.mediasSingle?.mainfile
        },
        quantity: {
          label: 'Ingresa al menos una referencia con pares',
          isValid: this.totals.totalPairs
        }
      };

      // añadir un campo global
      const allValid = Object.values(items).every(
        field => typeof field === 'object' ? field.isValid : true
      );

      return { items, allValid };
    }
  },
  methods: {
    init() {
      this.getOrder();
    },
    getOrder() {
      if (this.orderId) {
        this.loading = true;
        this.form.rows = [];
        let requestParams = {
          params: {
            include: 'items.shoe.translations'
          }
        };
        this.$crud.show('apiRoutes.qfulfillment.orders', this.orderId, requestParams).then(res => {
          const order = res.data;
          this.form.accountId = order.accountId;
          this.form.locatableId = order.locatableId;
          this.form.dueDate = order.dueDate;
          this.form.externalId = order.externalId;
          this.form.comment = order.comment;
          this.form.mediasSingle = order.mediasSingle;
          res.data.items.forEach(item => this.setReference(item));
        }).finally(() => this.loading = false);
      }
    },
    setReference(item = null) {
      const shoe = item?.shoe ?? this.formAddReference.shoe;
      const selectedOptions = item?.options ??
        this.loadedShoeOptions.filter(i => this.formAddReference.options.includes(i.id.toString()));
      let newRow = {
        reference: shoe,
        options: selectedOptions,
        labelOptions: selectedOptions.map(i => {
          let label = i.title;
          if (i.parent) label = `[${i.parent.title}] ${i.title}`;
          return `<div class="text-caption text-blue-grey">- ${label}</div>`;
        }).join(''),
        price: shoe.totalPrice
      };

      for (let i = this.sizes.min; i <= this.sizes.max; i++) {
        const itemSize = item?.sizes?.find(s => s.size == i);
        newRow[i] = itemSize ? itemSize.quantity : 0;
      }

      this.form.rows.push(newRow);
      this.formAddReference.shoe = null;
      this.formAddReference.options = [];
    },
    toNumber(val) {
      const n = Number(val);
      return Number.isFinite(n) ? n : 0;
    },
    isValidQty(val) {
      const n = this.toNumber(val);
      return n >= 0;
    },
    normalizeQty(val) {
      const n = this.toNumber(val);
      return Math.max(0, Math.floor(n));
    },
    rowTotal(row) {
      let total = 0;
      for (let i = this.sizes.min; i <= this.sizes.max; i++) {
        const n = Number(row[i] ?? 0);
        if (!Number.isNaN(n)) total += n;
      }
      return total;
    },
    getFormOrderData() {
      return {
        accountId: this.form.accountId,
        locatableId: this.form.locatableId,
        dueDate: this.form.dueDate,
        externalId: this.form.externalId,
        comment: this.form.comment,
        mediasSingle: this.form.mediasSingle,

        quantity: this.form.rows.reduce((total, i) => total + this.rowTotal(i), 0),
        price: this.form.rows.reduce((total, i) => total + i.price, 0),
        items: this.form.rows.map(i => ({
          'shoeId': i.reference.id,
          'quantity': this.rowTotal(i),
          'options': i.options,
          'sizes': Object.keys(i).filter(k => k >= this.sizes.min && k <= this.sizes.max).map(k => ({
            'size': k,
            'quantity': i[k]
          }))
        }))
      };
    },
    createOrder() {
      this.loading = true;
      let order = this.getFormOrderData();
      this.$crud.create('apiRoutes.qfulfillment.orders', order).then(res => {
        this.$alert.info({ message: `${this.$tr('isite.cms.message.recordCreated')}` });
        this.$router.push({ name: 'qfulfillment.admin.orders.index' });
      }).catch(err => {
        this.$alert.error({ message: `${this.$tr('isite.cms.message.recordNoCreated')}` });
      }).finally(() => {
        this.loading = false;
      });
    },
    updateOrder() {
      this.loading = true;
      let order = this.getFormOrderData();
      this.$crud.update('apiRoutes.qfulfillment.orders', this.orderId, order).then(res => {
        this.$alert.info({ message: `${this.$tr('isite.cms.message.recordUpdated')}` });
      }).catch(err => {
        this.$alert.error({ message: `${this.$tr('isite.cms.message.recordNoUpdated')}` });
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>
<style lang="stylus">
</style>
