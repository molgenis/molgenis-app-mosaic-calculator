<template>
  <div class="container">
    <h1>Mosaic App</h1>
    <div class="row">
      <div class="col-md-6">
        <form>
          <div class="form-group">
            <div class="custom-file">
              <input type="file" class="custom-file-input" id="eventFile" @change="processFile($event)">
              <label class="custom-file-label" for="eventFile">{{eventFileLabel}}</label>
            </div>
          </div>
          <div class="form-group">
            <div class="custom-file">
              <input type="file" class="custom-file-input" id="snpFile" @change="processFile($event)">
              <label class="custom-file-label" for="snpFile">{{snpFileLabel}}</label>
            </div>
          </div>
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
          <button type="submit" class="btn btn-primary" v-on:click="calculate">Calculate</button>
          <button type="button" class="ml-1 btn btn-info" v-on:click="doJob(experimentRowId)" :disabled=running><i v-show="running" class="fas fa-spinner fa-spin"></i> Test Job</button>
          <button type="button" class="ml-1 btn btn-secondary" v-on:click="testPdf" :disabled=running> Test PDF</button>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div v-if="resultUrl">
          <div id="pdfvuer">
            <pdf :src="pdfdata" v-for="i in numPages" :key="i" :id="i" :page="i"
                 :scale="scale" style="width:100%;margin:20px auto;">
              <template slot="loading">
                loading content here...
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

const formFields = [{
  id: 'gender',
  type: 'enum'
}, {
  id: 'eventFile',
  type: 'file'
}, {
  id: 'snpFile',
  type: 'file'
}]

export default Vue.extend({
  name: 'HelloWorld',
  components: {
    pdf: pdfvuer
  },
  data () {
    return {
      experimentRowId: null,
      running: false,
      interval: null,
      resultUrl: null, // '/files/5806213a69f14f3db00d81e59d6256af..pdf',
      eventFileLabel: 'Deviations event file',
      snpFileLabel: 'B allele frequencies file',
      eventFile: {},
      snpFile: {},
      gender: '',
      page: 1,
      numPages: 0,
      pdfdata: undefined,
      errors: [],
      scale: 'page-width'
    }
  },
  methods: {
    testPdf () {
      this.getPdf(this.resultUrl)
    },
    calculate (event) {
      if (event) {
        event.preventDefault()
      }
      const formData = {
        gender: this.gender,
        eventFile: this.eventFile,
        snpFile: this.snpFile
      }

      experimentRepository.save(formData, formFields).then((entityId) => {
        console.log('entity id: ' + entityId)
        this.experimentRowId = entityId
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
              this.getPdf(this.resultUrl)
            } else {
              alert('Error running stuff')
            }
          }
        })
      }, 1000)
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
      let self = this
      self.pdfdata = pdfvuer.createLoadingTask(pdfUrl)
      self.pdfdata.then(pdf => {
        self.numPages = pdf.numPages
      })
    },
    findPos (obj) {
      return obj.offsetTop
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
})
</script>
