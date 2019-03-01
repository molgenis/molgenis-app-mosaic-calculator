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
          <button type="submit" class="btn btn-primary" v-on:click="calculate" :disabled=running>Calculate</button>
          <!--<button type="button" class="ml-1 btn btn-info" v-on:click="doJob(experimentRowId)" :disabled=running>Test Job</button>-->
          <!--<button type="button" class="ml-1 btn btn-secondary" v-on:click="testPdf" :disabled=running>Test PDF</button>-->
        </form>
      </div>
    </div>

    <div class="mosaic-spacer row mt-2 mb-2">
      <div class="col">
        <hr/>
      </div>
    </div>

    <div class="row" v-show="running">
      <div class="col-md-6">
        <span>
          <i class="fas fa-spinner fa-spin"></i>
          <span v-show="!experimentRowId"> Uploading data ...</span>
          <span v-show="experimentRowId"> Running analysis, this can take some time ...</span>
        </span>
      </div>
    </div>

    <div v-if="resultUrl" class="row">
      <div class="col-md-6">
        <a class="btn btn-primary" :href=resultUrl>Download pdf</a>
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
import pdfvuer from 'pdfvuer'
import * as experimentRepository from '@/repository/ExperimentRepository'
import * as scriptJobRepository from '@/repository/ScriptJobRepository'

export default Vue.extend({
  name: 'HelloWorld',
  components: {
    pdf: pdfvuer
  },
  data () {
    return {
      experimentRowId: null,
      eventFile: {},
      snpFile: {},
      gender: '',
      running: false,
      interval: null,
      resultUrl: null, // '/files/94a090db097d438086d74777898b7432..pdf',
      eventFileLabel: 'Select file',
      snpFileLabel: 'Select file',
      numPages: 0
    }
  },
  methods: {
    calculate (event) {
      if (event) {
        event.preventDefault()
      }
      this.running = true

      const formData = {
        gender: this.gender,
        eventFile: this.eventFile,
        snpFile: this.snpFile
      }

      experimentRepository.saveExpData(formData).then((entityId) => {
        this.experimentRowId = entityId
        this.doJob(this.experimentRowId)
      })
    },
    doJob (experimentRowId) {
      this.running = true
      const pollData = this.pollData
      scriptJobRepository.run(experimentRowId).then((scriptJobId) => {
        pollData(scriptJobId)
      })
    },
    pollData (scriptJobId) {
      this.interval = setInterval(() => {
        console.log('polling')
        scriptJobRepository.poll(scriptJobId).then((pollResponse) => {
          console.log(pollResponse.log)
          if (pollResponse.status !== 'RUNNING') {
            clearInterval(this.interval)
            this.running = false

            if (pollResponse.status === 'SUCCESS') {
              this.resultUrl = pollResponse.resultUrl
              this.storeResultId(this.experimentRowId, this.resultUrl)
              this.getPdf(this.resultUrl)
            } else {
              alert('Error running stuff')
            }
          }
        })
      }, 1000)
    },
    storeResultId (experimentRowId, resultUrl) {
      experimentRepository.saveResultFileId(experimentRowId, resultUrl).then((result) => {
        console.log('result id stored')
      })
    },
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
        alert('Error file is missing.')
      }
    },
    getPdf (pdfUrl) {
      pdfvuer.createLoadingTask(pdfUrl).then(pdf => {
        this.numPages = pdf.numPages
      })
    },
    findPos (obj) {
      return obj.offsetTop
    },
    testPdf () {
      this.getPdf(this.resultUrl)
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
})
</script>
