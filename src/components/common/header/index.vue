<template>
  <div class="m_mod_header" :class="{'fixed': fixed}">
    <div class="m_mod_header_left" >
      <slot name="left"></slot>
    </div>
    <div class="m_mod_header_default">
      <slot></slot>
    </div>

    <div class="m_mod_header_right" >
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MHeader',
  props: {
    fixed: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss">
@import '../../../assets/css/variable/variable.scss';

.m_mod_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  background: $bg_white;
  &_default {
    flex: 2;
    font-size: 20px;
    text-align: center;
  }
  &_left,
  &_right {
    flex: 1
  }
  &_left {
    display: flex;
    justify-content: flex-start;
  }
  &_right {
    display: flex;
    justify-content: flex-end;
  }
  &.fixed {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }
}
</style>


