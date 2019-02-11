<template>
  <b-form-group :id="id+'-setting'"
                :label="label + ':'"
                label-for="probes-input">
    <b-form-input :id="id+'-input'"
                  type="number"
                  v-model="value"
                  required
                  :placeholder="label">
    </b-form-input>
  </b-form-group>
</template>

<script>
export default {
  name: 'setting',
  props: ['id', 'label', 'defaultValue'],
  data () {
    return {
      value: this.defaultValue
    }
  }
}
</script>
