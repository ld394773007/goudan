<template>
  <div>
    <div class="answer-label" v-for="(answer, i) in item.items" v-if="item.type < 5" :key="i">
        <label class="answer-content" v-if="item.type == 1">
          <mu-radio :label="`${answer.key}.`" :name="'radio' + index" :nativeValue="answer.key" v-model="item.answer" />
          <div v-html="answer.value"></div>
        </label>
        <label class="answer-content" v-if="item.type == 2">
          <mu-checkbox  :label="`${answer.key}.`" name="checkbox" :nativeValue="answer.key" v-model="item.answer" />
          <div v-html="answer.value"></div>
        </label>
        <div class="answer-input" v-if="item.type == 4">
          <mu-text-field hintText="此处填写答案" v-model="input[i]"/>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: {}
    },
    index: {
      type: [Number, String],
      default: 0
    }
  },
  created() {
    if (this.item.type === 4) {
      this.input = this.item.answer.split(',')
    }
  },
  watch: {
    input(n, o) {
      this.item.answer = n.join()
    }
  },
  data() {
    return {
      input: []
    }
  }
}
</script>

