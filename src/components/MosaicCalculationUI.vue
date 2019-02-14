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
            <b-form-radio value="male">
              <font-awesome-icon icon="mars"/>
              Male
            </b-form-radio>
            <b-form-radio value="female">
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
        <b-btn variant="primary" :disabled="!filesLoaded" @click="process">
          <font-awesome-icon icon="calculator"/>
          Calculate
        </b-btn>
        <b-btn variant="primary" :disabled="!output">
          <font-awesome-icon icon="download"/>
          Download output
        </b-btn>
        <small>
          <span id="status" class="float-right">
            <font-awesome-icon icon="spinner" spin v-if="status === 'loading'"/>
            <font-awesome-icon icon="check" v-if="status === 'success'"/>
            {{this.statusMsg}}
          </span>
        </small>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import FileInput from './FileInput'
import SettingsPanel from './SettingsPanel'
import helpers from '../helpers/tools.ts'
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'mosaic-calculation-ui',
  components: { FileInput, SettingsPanel },
  methods: {
    ...mapMutations(['SET_EVENTS', 'SET_ARRAY']),
    ...mapActions(['CREATE_TABLE', 'ADD_LINES']),
    process () {
      // Generate random tablename for events and array table
      this.eventsTable = helpers.generateRandomString()
      this.arrayTable = helpers.generateRandomString()
      this.setStatus('loading', 'Creating temporary events table...')
      // Generate the tables in molgenis
      // this.CREATE_TABLE({ tableName: this.eventsTable, type: 'events', callback: this.processEvents })
      this.setStatus('loading', 'Creating temporary array table...')
      this.CREATE_TABLE({ tableName: this.arrayTable, type: 'array', callback: this.processArray })
    },
    setStatus (status, message) {
      this.statusMsg = message
      this.status = status
    },
    processArray () {
      const self = this
      const array = this.$store.state.array
      helpers.parseArrayFile(array, (lines) => {
        this.setStatus('loading', 'Adding array data to temporary table...')
        const chunks = helpers.chunks(lines, 1000)
        const total = chunks.length
        let current = 0
        chunks.forEach((lineBatch) => {
          self.ADD_LINES({
            lines: lineBatch,
            table: this.arrayTable,
            callback: () => {
              current += 1
              this.setStatus(total === current ? 'success' : 'loading', `Array data part ${current} of ${total} added to temporary table`)
            }
          })
        })
      })
    },
    processEvents () {
      const self = this
      const events = this.$store.state.events
      helpers.parseEventsFile(events, (sex, lines) => {
        this.setStatus('loading', 'Setting sex...')
        // Select sex based on #Gender in events file
        self.selectedSex = sex
        this.setStatus('loading', 'Adding events data to temporary table...')
        self.ADD_LINES({
          lines,
          table: this.eventsTable,
          callback: () => {
            this.setStatus('success', 'Events data added to temporary table')
          }
        })
      })
    }
  },
  data () {
    return {
      selectedSex: '',
      filesLoaded: true,
      output: false,
      eventsTable: '',
      arrayTable: '',
      status: '',
      statusMsg: ''
    }
  }
}
</script>
