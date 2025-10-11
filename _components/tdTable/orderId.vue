<script setup>
import { defineProps } from 'vue';

defineProps({ order: Object });
</script>
<template>
  <q-td style="padding: 8px !important;">
    <div class="row" style="min-width: 180px">
      <div class="col text-center">
        <div class="text-caption text-grey">Compra</div>
        {{ order.externalId }}
      </div>
      <q-separator vertical inset />
      <div class="col text-center">
        <div class="text-caption text-grey">Pedido</div>
        {{ order.id }}
      </div>
    </div>
  </q-td>
</template>
