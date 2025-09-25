<template>
  <div id="formOrder">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="box">
          <div class="q-mb-md text-info">
            <q-icon name="fas fa-boot" class="q-mr-sm" />
            Pedido
          </div>
          <q-table
            flat bordered separator="cell"
            :rows="form.rows"
            :columns="columns"
            row-key="id"
            hide-pagination
          >
            <!-- Columns -->
            <template v-slot:body-cell="props">
              <q-td :props="props">
                <div v-if="props.col.name == 'reference'">
                  {{ props.row[props.col.name].title }}
                  <div class="text-caption text-grey">
                    {{ props.row.labelOptions }}
                  </div>
                </div>
                <!-- total calculado -->
                <div v-else-if="props.col.name === 'total'" class="text-right">
                  {{ rowTotal(props.row) }}
                </div>
                <div v-else :class="props.row[ props.col.name ] ? 'bg-info' : ''">
                  <q-input
                    v-model.number="props.row[ props.col.name ]"
                    input-class="text-right"
                    type="number"
                    dense
                    borderless
                  />
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

      <div class="col-6">
        <div class="box">
          <div class="q-mb-md text-info">
            <q-icon name="fas fa-user" class="q-mr-sm" />
            Cliente
          </div>
          <dynamic-field v-model="form.account" :field="dynamicFields.account" />
          <dynamic-field v-model="form.location" :field="dynamicFields.locationId" />
          <dynamic-field v-model="form.externalId" :field="dynamicFields.externalId" class="q-mb-md" />
          <dynamic-field :field="dynamicFields.mediaSingle" />
        </div>
      </div>
      <div class="col-6">
        <div class="box">
          <div class="q-mb-md text-info">
            <q-icon name="fas fa-user" class="q-mr-sm" />
            Resumen
          </div>
          <q-list separator>
            <q-item>
              <q-item-section>
                <q-item-label>Pares Totales</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label>
                  {{ form.rows.reduce((total, i) => total + this.rowTotal(i), 0) }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Referencias</q-item-label>
                <q-item-label caption lines="2">
                  {{ form.rows.map(i => i.reference.title).join(', ') }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label>{{form.rows.length}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="form.account">
              <q-item-section>
                <q-item-label>{{ form.account.title }} ({{ form.account.type.title }})</q-item-label>
                <q-item-label caption lines="2">
                  {{ form.account.documentType.title }}: {{ form.account.document }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="form.location">
              <q-item-section>
                <q-item-label>{{ form.location.address }}</q-item-label>
                <q-item-label caption lines="2">
                  {{ form.location.province.name }}, {{ form.location.city.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-btn
            outline rounded no-caps
            label="Crear" color="positive"
            icon="fa-light fa-save"
            class="full-width q-mt-md"
            @click="createOrder"
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
      form: {
        account: null,
        location: null,
        externalId: null,
        rows: []
      },
      sizes: { min: 34, max: 46 },
      formAddReference: {
        show: false,
        shoe: null,
        options: []
      },
      loadedShoeOptions: []
    };
  },
  computed: {
    dynamicFields() {
      return {
        account: {
          type: 'select',
          props: {
            label: 'Cliente',
            emitValue: false
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qaccount.accounts',
            select: { label: 'title', id: 'id' }
          }
        },
        locationId: {
          type: 'select',
          props: {
            label: 'Dirección',
            emitValue: false,
            disable: !this.form.account
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
            select: { label: 'title', id: 'id' }
          }
        },
        externalId: {
          type: 'input',
          props: {
            label: 'ID Externo'
          }
        },
        mediaSingle: {
          type: 'media',
          props: {
            label: 'Documento Soporte',
            zone: 'mainimage',
            entity: 'Modules\\Ifulfillment\\Models\\Order',
            entityId: null,
            accept: 'images',
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
        columns.push({ name: i, label: i, field: i, align: 'right' });
      }

      columns.push({ name: 'total', label: 'Total', field: 'total', align: 'right' });
      return columns;
    }
  },
  methods: {
    init() {
    },
    setReference() {
      const selectedOptions = this.loadedShoeOptions.filter(i => this.formAddReference.options.includes(i.id.toString()));
      let newRow = {
        reference: this.formAddReference.shoe,
        options: selectedOptions,
        labelOptions: selectedOptions.map(i => {
          if (i.parent) return `[${i.parent.title}] ${i.title}`;
          return i.title;
        }).join(', '),
        price: this.formAddReference.shoe.totalPrice
      };

      for (let i = this.sizes.min; i <= this.sizes.max; i++) {
        newRow[i] = 0;
      }

      this.form.rows.push(newRow);
      this.formAddReference.shoe = null;
      this.formAddReference.options = [];
    },
    rowTotal(row) {
      let total = 0;
      for (let i = this.sizes.min; i <= this.sizes.max; i++) {
        const n = Number(row[i] ?? 0);
        if (!Number.isNaN(n)) total += n;
      }
      return total;
    },
    createOrder() {
      let order = {
        accountId: this.form.accountId,
        externalId: this.form.externalId,
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

      this.$crud.create('apiRoutes.qfulfillment.orders', order).then(res => {
      });
    }
  }
};
</script>
<style lang="stylus">
</style>
