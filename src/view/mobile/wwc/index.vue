<template>

</template>
<script>
export default {
  data() {
    return {
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      next(from.path)
      vm.$vux.toast.text('内容正在建设中')
    })
  }
}
</script>

