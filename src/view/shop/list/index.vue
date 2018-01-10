<template>
  <div class="list-wrap">
    <div class="details-header">
      <i class="icon-back" @click="goBack"></i>
      <p>课程超市</p>
    </div>
    <div class="list-content">
      <h2>发现有<span>{{listData.length}}</span>个课程可以报名</h2>
      <ul class="list-con">
        <li class="list-item" :key="item.id" v-for="(item,index) in listData">
          <router-link :to="'/shop/commodity?id='+ item.id">
            <mu-card>
              <mu-card-media>
                <img :src="item.image_src" />
              </mu-card-media>
              <mu-card-title :title="item.pro_name"/>
              <mu-card-text>
                {{item.pro_brief}}
              </mu-card-text>
              <mu-card-actions>
                <p class="list-price">￥{{item.price}}</p>
              </mu-card-actions>
            </mu-card>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'list',
    data() {
      return {
        listData: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      // 获取商品列表
      getList() {
        let { get } = window.instance

        get('/v1/product/list', {expand: 'link,images,platform'})
        .then(({data}) => {
          if (!data.status) {
            this.listData = data.data
          } else {
            this.$vux.alert.show({
              content: data.message
            })
          }
        })
      }
    }
  }
</script>

<style scope>
  .list-content {
    padding: 0 15px;
    min-height: calc(100vh - 44px);
    background: #fff;
    border: 1px #fff solid;
  }
  .list-content > h2 {
    margin: 10px 0;
    color: #ccc;
  }

  .list-content > h2 > span {
    color: #666;
    margin: 0 10px;
  }

  .list-item {
    margin: 15px 0;
  }

  .list-time {
    color: #ccc;
  }

  .list-price {
    color: #D0021B;
    font-size: 16px;
  }
  .mu-card-title-container {
    padding: 8px 16px;
  }
  .mu-card-text {
    padding: 0 16px;
  }

  .mu-card-actions {
    padding: 8px 16px;
  }

  .mu-card-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
