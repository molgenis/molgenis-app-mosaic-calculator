<template>
  <div id="app">
    <MosaicCalculationUI/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MosaicCalculationUI from './components/MosaicCalculationUI.vue'

export default Vue.extend({
  name: 'app',
  components: {
    MosaicCalculationUI
  }
})
</script>
