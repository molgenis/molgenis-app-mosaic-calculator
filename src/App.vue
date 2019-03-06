<template>
  <div id="app">
    <!--<img alt="Vue logo" src="./assets/logo.png">-->
    <MosaicView />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MosaicView from './components/MosaicView.vue'

export default Vue.extend({
  name: 'app',
  components: {
    MosaicView
  }
})
</script>
