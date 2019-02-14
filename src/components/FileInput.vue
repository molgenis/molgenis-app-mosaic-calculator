<template>
  <b-form-group
    :id="id +'-input-label'"
    :label="label"
    :label-for="id+'-input-file'"
  >
    <b-form-file :id="id+'-input-file'" :state="Boolean(file)" ref="fileinput" v-model="file"
                 placeholder="Choose a file..." @change="saveFile"></b-form-file>
  </b-form-group>
</template>

<script>

export default {
  name: 'file-input',
  props: ['label', 'id', 'mutation'],
  data () {
    return {
      file: null
    }
  },
  methods: {
    saveFile () {
      const file = this.$refs.fileinput.$refs.input.files[0]
      this.mutation(file)
    }
  }
}
</script>

<style scoped>

</style>
