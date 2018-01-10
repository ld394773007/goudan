<template>
  <div class="paper-content">
    <div class="paper-title">
      <span>{{item.sort}}</span>
      <div class="paper-title-content" v-html="item.title"></div>
    </div>
    <div class="paper-answer">
      <radio :item="item"></radio>
      <div class="child-qustion" v-if="item.type >= 5" :key="i" v-for="(qustion, i) in item.childs">
        <div class="paper-title" >
          <span>{{i+1}}</span>
          <div class="paper-title-content" v-html="qustion.title"></div>
        </div>
        <div class="paper-answer">
          <radio :item="qustion" :index="i"></radio>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import radio from './type/radio'
  export default {
    components: {
      radio
    },
    props: {
      item: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        radio: ''
      }
    },
    watch: {
      'item.childs': {
        handler(n, o) {
          this.item.answer = n.map((v) => {
            return {id: v.learn_id, answer: v.answer ? v.answer : ''}
          })
        },
        deep: true
      }
    }
  }
</script>

