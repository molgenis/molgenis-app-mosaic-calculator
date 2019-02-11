<template>
  <b-form-group
    :id="id +'-input-label'"
    :label="label"
    :label-for="id+'-input-file'"
  >
    <b-form-file :id="id+'-input-file'" v-model="file" :state="Boolean(file)"
                 placeholder="Choose a file..."></b-form-file>
  </b-form-group>
</template>

<script>
export default {
  name: 'file-input',
  props: ['label', 'id'],
  data () {
    return {
      file: undefined
    }
  }
}
</script>

<style scoped>

</style>
