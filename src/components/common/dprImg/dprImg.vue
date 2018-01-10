<template>
  <img :src="src">
</template>
<script>
export default {
  name: 'DprImg',
  props: {
    path: {
      type: String,
      default: '',
      required: true
    }
  },
  computed: {
    src() {
      const {path} = this
      const dpr = window.devicePixelRatio
      const fileName = path.substring(path.lastIndexOf('/'), path.lastIndexOf('.'))
      console.log(path.replace(fileName, fileName + '@2x'))
      if (dpr === 2) {
        return path.replace(fileName, fileName + '@2x')
      } else if (dpr === 3) {
        return path.replace(fileName, fileName + '@3x')
      } else {
        return path.replace(fileName, fileName + '@2x')
      }
    }
  }
}
</script>

