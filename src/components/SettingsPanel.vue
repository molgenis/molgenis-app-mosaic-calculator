<template>
  <div role="tablist">
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab" @click="toggleIcon">
        <b-btn block href="#" v-b-toggle.settings-dialog variant="secondary">
          <font-awesome-icon icon="cogs"/> Advanced settings
          <font-awesome-icon :icon="icon"/>
        </b-btn>
      </b-card-header>
      <b-collapse id="settings-dialog" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <p class="card-text">
            <setting id="probes" label="Number of probes" defaultValue="10"></setting>
            <setting id="event-length" label="Length of event (in kb)" defaultValue="100"></setting>
            <setting id="allelic-imbalance-length" label="Length of an allelic imbalance event (in mb)" defaultValue="5"></setting>
            <setting id="p-value" label="P-value threshold" defaultValue="0.05"></setting>
          </p>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import Setting from './Setting'
export default {
  name: 'settings-panel',
  components: { Setting },
  data () {
    return {
      icon: 'caret-down'
    }
  },
  methods: {
    toggleIcon () {
      this.icon = this.icon === 'caret-down' ? 'caret-up' : 'caret-down'
    }
  }
}
</script>
