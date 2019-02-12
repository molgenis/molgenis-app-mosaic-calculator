<template>
  <b-container class="mosaic-calculation-container">
    <b-row>
      <b-col>
        <h1>Mosaic calculation tool</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <file-input id="events" :mutation="SET_EVENTS" label="Events file"/>
        <file-input id="array" :mutation="SET_ARRAY" label="Nexus SNP Array input file"/>
        <b-form-group label="Sex">
          <b-form-radio-group id="sex" v-model="selectedSex" name="sexSelection" stacked>
            <b-form-radio value="Male">
              <font-awesome-icon icon="mars"/>
              Male
            </b-form-radio>
            <b-form-radio value="Female">
              <font-awesome-icon icon="venus"/>
              Female
            </b-form-radio>
            <b-form-radio value="Unknown">
              <font-awesome-icon icon="genderless"/>
              Unknown
            </b-form-radio>
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
        <b-btn variant="primary" :disabled="!filesLoaded" @click="selectSex">
          <font-awesome-icon icon="calculator"/>
          Calculate
        </b-btn>
        <b-btn variant="primary" :disabled="!output">
          <font-awesome-icon icon="download"/>
          Download output
        </b-btn>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import FileInput from './FileInput'
import SettingsPanel from './SettingsPanel'
import lineReader from '../helpers/lineReader.ts'
import { mapMutations } from 'vuex'

export default {
  name: 'mosaic-calculation-ui',
  components: { FileInput, SettingsPanel },
  methods: {
    ...mapMutations(['SET_EVENTS', 'SET_ARRAY']),
    selectSex (eventsFile) {
      const self = this
      const events = this.$store.state.events
      lineReader.readSomeLines(events, 50, function (line) {
        if (line.startsWith('#Gender')) {
          self.selectedSex = line.split(' = ')[1].replace(/(\r\n|\n|\r| |\t)/gm, '')
        }
        return true
      }, function () { console.log('Done') }, function (error) { console.log(error) })
    }
  },
  data () {
    return {
      selectedSex: '',
      filesLoaded: true,
      output: false
    }
  }
}
</script>
