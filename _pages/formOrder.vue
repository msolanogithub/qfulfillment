<template>
  <div id="formOrder">
    <dynamic-field v-model="form.accountId" :field="dynamicFields.accountId" />
    <dynamic-field v-model="form.locationId" :field="dynamicFields.locationId" />
    <dynamic-field v-model="form.externalId" :field="dynamicFields.externalId" />

    <div class="q-py-md">
      <q-table
        flat bordered
        title="Referencias"
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
    </div>

    <!-- Save Action -->
    <div class="row justify-between">
      <q-btn
        color="blue"
        unelevated rounded
        no-caps
        icon="fa-light fa-plus"
        label="Agregar Referencia"
        @click="formAddReference.show = true"
      />

      <q-btn
        unelevated rounded no-caps
        label="Crear" color="positive"
        icon="fa-light fa-save"
        @click="createOrder"
      />
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
        accountId: null,
        locationId: null,
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
        accountId: {
          type: 'select',
          props: {
            label: 'Account',
            options: []
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qaccount.accounts',
            select: { label: 'title', id: 'id' }
          }
        },
        locationId: {
          type: 'select',
          props: {
            label: 'Location',
            options: [],
            disable: !this.form.accountId
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qlocations.locatables',
            requestParams: {
              include: 'translations',
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

      this.$crud.create('apiRoutes.qfulfillment.orders', order).then(res => {})
    }
  }
};
</script>
<style lang="stylus">
</style>
