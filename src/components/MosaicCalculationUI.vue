<template>
  <b-container class="mosaic-calculation-container">
    <b-row>
      <b-col>
        <h1>Mosaic calculation tool</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <file-input id="events" :mutation="SET_EVENTS" label="Events file" :onChange="resetEvents"/>
        <file-input id="array" :mutation="SET_ARRAY" label="Nexus SNP Array input file"/>
        <b-form-group label="Sex">
          <b-form-radio-group id="sex" v-model="selectedSex" name="sexSelection" stacked :disabled="!sexWarning">
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
        <b-alert :show="!sexWarning&&selectedSex===''" dismissible variant="primary">
          Sex will be set from events file if a line starting with "#Gender" is present.
        </b-alert>
        <b-alert :show="sexWarning" variant="warning" class="text-center">
          <b-row>
            <b-col>
              No line starting with "#Gender" found in events file. Please select sex manually.
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <br/>
              <b-button variant='success' size="sm" :disabled="selectedSex === ''" @click="proceedProcess">
                <font-awesome-icon icon="check"/>
              </b-button>
            </b-col>
          </b-row>
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <settings-panel></settings-panel>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-show="status != ''">
        <hr/>
        <b-progress :value="Math.round(this.progress)" :max="100" show-value class="mb-3" :variant="statusStyle"/>
        <span id="status" :class="'text-' + statusStyle">
            <font-awesome-icon icon="spinner" spin v-if="status === 'loading'|| status=== 'waiting'"/>
            <font-awesome-icon icon="check" v-if="status === 'success'"/>
            <font-awesome-icon icon="times" v-if="status === 'error'"/>
            {{this.statusMsg}}
          </span>
        <hr/>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-btn variant="primary" @click="process" :disabled="!filesLoaded">
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
  import helpers from '../helpers/tools.ts'
  import fileParsers from '../helpers/fileParsers.ts'
  import { mapMutations, mapActions } from 'vuex'

  export default {
    name: 'mosaic-calculation-ui',
    components: {FileInput, SettingsPanel},
    methods: {
      ...mapMutations(['SET_EVENTS', 'SET_ARRAY']),
      ...mapActions(['CREATE_TABLE', 'ADD_LINES']),
      process () {
        // Generate random tablename for events and array table
        this.eventsTable = helpers.generateRandomString()
        this.arrayTable = helpers.generateRandomString()
        // Generate the tables in molgenis
        this.createTable(this.eventsTable, 'events', this.processEvents)
      },
      createTable (table, type, callback) {
        this.setStatus('loading', `Creating temporary ${type} table`, 0)
        this.CREATE_TABLE({
          tableName: table,
          type: type,
          callback: callback
        })
      },
      setStatus (status, message, progress) {
        this.progress += progress
        this.statusMsg = message
        this.status = status
      },
      processArray () {
        const self = this
        const array = this.$store.state.array
        fileParsers.parseArrayFile(array, (lines) => {
            this.setStatus('loading', 'Adding array data to temporary table', 5)
            const chunks = helpers.chunks(lines, 1000)
            const total = chunks.length
            let current = 0

            chunks.forEach((lineBatch) => {
              self.ADD_LINES({
                lines: lineBatch,
                table: this.arrayTable,
                callback: () => {
                  current += 1
                  this.setStatus(total === current ? 'success' : 'loading',
                    total === current ? 'Temporary array table filled' : 'Adding array data to temporary table',
                    65 / total)
                }
              })
            })
          }, this.exp,
          (errorMsg) => { this.setStatus('error', errorMsg, 0) })
      },
      processEvents () {
        const self = this
        const events = this.$store.state.events
        fileParsers.parseEventsFile(events, (sex, lines, exp) => {
          self.events = lines
          self.exp = exp
          this.setStatus('loading', 'Setting sex', 1)
          if (sex !== '') {
            // Select sex based on #Gender in events file
            self.selectedSex = sex
            this.proceedProcess()
          } else {
            this.setStatus('waiting', 'Waiting for user to select sex', 0)
            self.sexWarning = true
          }
        }, (errorMsg) => { this.setStatus('error', errorMsg, 0) })
      },
      resetSexWarning () {
        this.setStatus('', '', 0)
        this.sexWarning = false
      },
      resetEvents () {
        this.resetSexWarning()
        this.exp = ''
      },
      proceedProcess () {
        this.resetSexWarning()
        this.setStatus('loading', 'Adding events data to temporary table', 1)
        this.ADD_LINES({
          lines: this.events,
          table: this.eventsTable,
          callback: () => {
            this.setStatus('success', 'Events data added to temporary table', 3)
            this.createTable(this.arrayTable, 'array', this.processArray)
          }
        })
      }

    },
    data () {
      return {
        progress: 0,
        selectedSex: '',
        output: false,
        eventsTable: '',
        arrayTable: '',
        status: '',
        statusMsg: '',
        sexWarning: false,
        events: [],
        exp: ''
      }
    },
    computed: {
      statusStyle: function () {
        return `${this.status === 'error' ? 'danger' : this.status === 'success' ? 'success' : this.status === 'waiting' ? 'warning' : 'dark'}`
      },
      filesLoaded: function () {
        return this.$store.state.array && this.$store.state.events
      }
    }
  }
</script>
