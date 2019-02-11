<template>
  <b-container class="mosaic-calculation-container">
    <b-row>
      <b-col>
        <h1>Mosaic calculation tool</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <file-input id="nexus" label="Events file"/>
        <file-input id="array" label="Nexus SNP Array input file"/>
        <b-form-group label="Sex">
          <b-form-radio-group id="sex" v-model="selectedSex" name="sexSelection" stacked>
            <b-form-radio value="m"><font-awesome-icon icon="mars"/> Male</b-form-radio>
            <b-form-radio value="f"><font-awesome-icon icon="venus"/> Female</b-form-radio>
            <b-form-radio :value="u"><font-awesome-icon icon="genderless"/> Unknown</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
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
      selectedSex: '',
      filesLoaded: false,
      output: false
    }
  }
}
</script>
