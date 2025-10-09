<script setup>
import { defineProps } from 'vue';

const props = defineProps({ shoe: Object, selectedOptions: Array });

const mappedOptions = props.selectedOptions.map(i => {
  let fullLabel = `• ${i.title}`;
  if (i.parent) fullLabel = `• ${i.parent.title}: ${i.title}`;
  return {...i, fullLabel: fullLabel.toLowerCase()}
});
const diffOptions = mappedOptions.filter(b => !props.shoe.options.some(a => a.id === b.id));

const diffLabelOptions = diffOptions.map(i => i.fullLabel).join('<br>');
const labelDiffOptions = mappedOptions.map(i => i.fullLabel).join('<br>');
</script>

<template>
  <q-td :class="diffLabelOptions ? 'bg-orange-1' : ''">
    <div id="fulfillmentTdShoe" style="min-width: 200px; flex-wrap: wrap; text-transform: lowercase">
      <div class="row items-center">
        <div>
          <help-text
            :title="shoe.reference"
            :description="labelDiffOptions"
            class="q-mr-sm"
          />
        </div>
        <div>
          <b>{{ shoe.reference }}</b>
          <div class="text-caption text-grey">{{ shoe.title }}</div>
        </div>
      </div>

      <div>
        <div v-if="diffLabelOptions" class="text-caption break-text">
          <q-separator class="q-my-xs" inset />
          <span v-html="diffLabelOptions" />
        </div>
      </div>
    </div>
  </q-td>
</template>

<style scoped>
#fulfillmentTdShoe .break-text {
  white-space: normal !important;
  word-break: break-word;
  overflow-wrap: anywhere;
}
</style>
