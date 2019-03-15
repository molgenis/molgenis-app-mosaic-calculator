<template>
  <div>
    <!-- mock -->
  </div>
</template>
<script>

export default {
  createLoadingTask: (url) => {
    return url === 'validUrl' ? Promise.resolve({ numPages: 3 }) : Promise.reject(new Error('error'))
  }
}
</script>
