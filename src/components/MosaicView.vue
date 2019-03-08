<template>
  <div class="container">
    <h1>Mosaic App</h1>
    <div class="row">
      <div class="col-md-6">
        <form>
          <div class="form-group">
            <label for="event-file-container">Regions file</label>
            <div id="event-file-container" class="custom-file">
              <input type="file" class="custom-file-input" id="eventFile" @change="processFile($event)">
              <label class="custom-file-label" for="eventFile">{{eventFileLabel}}</label>
            </div>
          </div>
          <div class="form-group">
            <label for="event-file-container">SNPs file</label>
            <div id="snp-file-container" class="custom-file">
              <input type="file" class="custom-file-input" id="snpFile" @change="processFile($event)">
              <label class="custom-file-label" for="snpFile">{{snpFileLabel}}</label>
            </div>
          </div>
          <label>Gender</label>
          <div class="form-group">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Male" v-model="gender">
              <label class="form-check-label" for="inlineRadio1">Male</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Female" v-model="gender">
              <label class="form-check-label" for="inlineRadio2">Female</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="Unknown" v-model="gender">
              <label class="form-check-label" for="inlineRadio3">Unknown</label>
            </div>
          </div>
          <button id="calc-btn" type="submit" class="btn btn-primary" v-on:click="calculate" :disabled=isRunning>Calculate</button>
        </form>
      </div>
    </div>

    <div class="mosaic-spacer row mt-2 mb-2">
      <div class="col">
        <hr/>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger my-1" role="alert">
      {{ error }}
    </div>

    <div class="row" v-show="isRunning && !error">
      <div class="col-md-6">
        <span>
          <i class="fas fa-spinner fa-spin"></i>
          <span v-show="!experimentId"> Uploading data ...</span>
          <span v-show="experimentId"> Running analysis, this can take some time ...</span>
        </span>
      </div>
    </div>

    <div v-if="resultUrl" class="row">
      <div class="col-md-6">
        <a class="btn btn-primary" :href=resultUrl>Download pdf</a>
        <button type="button" class="ml-1 btn btn-info" v-on:click="removeData(experimentId, resultUrl)">Clear all data</button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div v-if="resultUrl && numPages">
          <div id="pdfvuer">
            <pdf :src="resultUrl"  :page="numPages - 1" scale="page-width">
              <template slot="loading">
                loading results...
              </template>
            </pdf>
            <pdf :src="resultUrl"  :page="numPages" scale="page-width">
              <template slot="loading">
                loading results...
              </template>
            </pdf>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import pdfvuer from 'pdfvuer'
import * as experimentRepository from '@/repository/ExperimentRepository'
import * as scriptJobRepository from '@/repository/ScriptJobRepository'

export default Vue.extend({
  name: 'MosaicView',
  components: {
    pdf: pdfvuer
  },
  data () {
    return {
      eventFile: {},
      snpFile: {},
      gender: '',
      interval: null,
      eventFileLabel: 'Select file',
      snpFileLabel: 'Select file',
      numPages: 0
    }
  },
  computed: {
    ...mapState(['experimentId', 'isRunning', 'resultUrl', 'error'])
  },
  methods: {
    processFile (event) {
      const fileType = event && event.target && event.target.id ? event.target.id : ''
      const file = event.target.files[0]
      if (fileType === 'eventFile') {
        this.eventFile = file
        this.eventFileLabel = file.name
      } else if (fileType === 'snpFile') {
        this.snpFile = file
        this.snpFileLabel = file.name
      } else {
        this.$store.commit('error', 'Error, unknown file type.')
      }
    },
    calculate (event) {
      event.preventDefault()
      this.$store.commit('isRunning', true)

      const formData = {
        gender: this.gender,
        eventFile: this.eventFile,
        snpFile: this.snpFile
      }

      experimentRepository.saveExpData(formData).then((entityId) => {
        this.$store.commit('experimentId', entityId)
        this.runJob(this.experimentId)
      }, () => {
        this.$store.commit('error', 'Error; Could not upload experiment data.')
      })
    },
    runJob (experimentId) {
      scriptJobRepository.run(experimentId).then((scriptJobId) => {
        this.pollJob(scriptJobId)
      }, () => {
        this.$store.commit('error', 'Error; Could not run job.')
      })
    },
    pollJob (scriptJobId) {
      this.interval = setInterval(() => {
        scriptJobRepository.poll(scriptJobId).then((pollResponse) => {
          if (pollResponse.status !== 'RUNNING') {
            clearInterval(this.interval)
            this.$store.commit('isRunning', false)
            if (pollResponse.status === 'SUCCESS') {
              this.$store.commit('resultUrl', pollResponse.resultUrl)
              this.storeResultId(this.experimentId, this.resultUrl)
              this.getPdf(this.resultUrl)
            } else {
              this.$store.commit('error', 'Error; Could not run job.')
            }
          }
        }, () => {
          this.error = 'Error; Could not run job.'
        })
      }, 1000)
    },
    storeResultId (experimentId, resultUrl) {
      experimentRepository.saveResultFileId(experimentId, resultUrl)
    },
    getPdf (pdfUrl) {
      pdfvuer.createLoadingTask(pdfUrl).then(pdf => {
        this.numPages = pdf.numPages
      }, () => {
        this.$store.commit('error', 'Error; Could not render results to page .')
      })
    },
    removeData (experimentId, resultUrl) {
      return experimentRepository.removeData(experimentId, resultUrl).then(() => {
        this.$store.commit('resultUrl', '')
        this.$store.commit('experimentId', '')
      }, () => {
        this.$store.commit('error', 'Error; Could not remove results, please contct the administrator')
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
})
</script>
