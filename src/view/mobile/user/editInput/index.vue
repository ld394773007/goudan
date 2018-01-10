<template>
  <div class="m_wrap">
    <m-header class="m_header"  fixed>
      <a href="javascript:" class="mod_button" slot="left" @click="save"><x-icon type="ios-arrow-back"></x-icon></a>
      <p class="absolute">修改信息</p>
      <a class="mod_button mod_button_text" href="javascript:" slot="right" @click="save">保存</a>
    </m-header>
    <group style="padding-top: 10px;" class="m_body bg_color" label-width="4.5em" label-margin-right="1em" label-align="right">
      <x-input :placeholder="data.title" v-model="value"></x-input>
    </group>
  </div>
</template>
<script>
import {Group, XInput} from 'vux'
export default {
  props: ['data'],
  components: {
    Group,
    XInput
  },
  data() {
    return {
      value: ''
    }
  },
  created() {
    console.log(this.data)
  },
  methods: {
    save() {
      let {value} = this
      let {key} = this.data
      let data = {}
      if (value !== '') {
        data[key] = value
        console.log(key, data)
        this.$emit('save', data)
      }
      this.$emit('close')
    }
  }
}
</script>

