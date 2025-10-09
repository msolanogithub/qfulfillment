<script setup>
import { defineProps } from 'vue';
defineProps({ order: Object });
</script>
<template>
  <q-td>
    Orden Producción
    : {{ order.id }}
    <div class="text-caption text-grey">
      Orden Compra: {{ order.externalId }}
    </div>
  </q-td>
</template>
