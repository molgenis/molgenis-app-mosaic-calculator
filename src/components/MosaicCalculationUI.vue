<template>
  <b-container class="mosaic-calculation-container">
    <b-row>
      <b-col>
        <h1>Mosaic calculation tool</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <file-input id="nexus" label="Nexus region file"/>
        <file-input id="array" label="Array input file"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <settings-panel></settings-panel>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-btn variant="primary" :disabled="!filesLoaded"><font-awesome-icon icon="calculator"/> Calculate</b-btn>
        <b-btn variant="primary" :disabled="!output"><font-awesome-icon icon="download"/> Download output</b-btn>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import FileInput from './FileInput'
import SettingsPanel from './SettingsPanel'

export default {
  name: 'mosaic-calculation-ui',
  components: { FileInput, SettingsPanel },
  data () {
    return {
      filesLoaded: false,
      output: false
    }
  }
}
</script>
