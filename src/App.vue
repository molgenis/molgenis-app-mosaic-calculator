<template>
  <div id="app">
    <MosaicView />
  </div>
</template>

<script>
import Vue from 'vue'
import MosaicView from './components/MosaicView.vue'

export default Vue.extend({
  name: 'app',
  components: {
    MosaicView
  }
})
</script>
