<template>
   <div>
    <mu-appbar class="header-bar">
      <mu-icon-button @click="$router.go(-1)" icon="keyboard_arrow_left" event="touchstart" slot="left"/>
      <p class="absolute">反馈</p>
    </mu-appbar>
    <group class="mt10" label-width="4.5em" label-margin-right="1em" label-align="right">
      <x-input placeholder="内容标题" v-model="feedback.title"></x-input>
      <x-textarea :max="200" name="description" placeholder="反馈内容" v-model="feedback.content"></x-textarea>
    </group>
    <mu-flat-button class="full-btn mt15" event="touchstart" label="提交" @click="submit" secondary/>
  </div>
</template>
<script>
import {Group, XInput, XTextarea} from 'vux'
export default {
  components: {
    Group,
    XInput,
    XTextarea
  },
  data() {
    return {
      feedback: {
        title: '',
        content: ''
      }
    }
  },
  methods: {
    submit() {
      let feedbackData = localStorage.getItem('feedback')
      let {title, content} = this.feedback
      if (!(title !== '' && content !== '')) {
        this.$vux.toast.text('请填写完整信息')
        return
      }
      if (feedbackData) {
        feedbackData = JSON.parse(feedbackData)
        feedbackData.push({title, content})
      } else {
        feedbackData = [{
          title,
          content
        }]
      }

      localStorage.setItem('feedback', JSON.stringify(feedbackData))
      this.$vux.toast.text('提交成功！')
    }
  }
}
</script>

