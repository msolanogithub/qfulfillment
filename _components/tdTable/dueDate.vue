<script setup>
import moment from 'moment';
import { defineProps } from 'vue';

const props = defineProps({ order: Object });
const dueDate = moment(props.order.dueDate);
const dueDateDiff = Math.max(dueDate.diff(moment(), 'days'), 0);
const colorDaysOff = dueDateDiff < 3 ? 'red' : dueDateDiff < 7 ? 'orange' : 'green';
</script>
<template>
  <q-td>
    <div class="row items-center no-wrap">
      <q-icon
        name="fas fa-hourglass-end"
        :color="colorDaysOff"
        class="q-mr-sm" size="xs"
      />
      <div>
        {{ order.dueDate }}
        <div class="text-caption text-grey">
          {{ dueDateDiff }} Días restantes
        </div>
      </div>
    </div>
  </q-td>
</template>
