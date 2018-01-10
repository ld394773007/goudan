<template>
  <div class="m_home">
    <m-header class="m_header" :fixed="true">
      <img class="m_header_logo" src="/static/images/mobile/yingyushu_icon@2x.png">
      <a class="mod_button mod_button_text" href="javascript:" slot="right" @click="addLesson">加入班级</a>
    </m-header>
    <m-srcoll class="m_body">
      <div class="content">
        <swiper
            :list="bannerList"
            :auto="true"
            :loop="true"
            :aspect-ratio="0.5182"
            :show-desc-mask="false"
            :show-dots="false"
          >
          </swiper>
        <div class="transfrom-wrap">
          <div class="m_home_nav border-wrap">
            <div class="m_home_nav_col" :key="i" v-for="(e,i) in navList">
              <a href="javascript:" @click="link(el)" class="m_home_nav_item" :key="index" v-for="(el,index) in e">
                <i class="m_home_nav_icon" :class="el.icon"></i>
                <span class="m_home_nav_text">{{el.title}}</span>
              </a>
            </div>
          </div>
          <div class="m_home_content border-wrap">
            <div class="m_home_content_title">
              <h2>练真题</h2>
              <p>已更新1436套题库</p>
            </div>
            <div class="m_home_content_wrap" @click="link({link:false, href: 'paperList'})">
              <div class="m_home_content_banner img_center">
                <img v-lazy="'/static/images/mobile/subject_banner@3x.jpg'" />
              </div>
              <ul class="m_home_content_list">
                <li>
                  <div class="content_list_left">
                    <img src="">
                  </div>
                  <div class="content_list_right">
                    <p>2017考研真题</p>
                    <span>评测过<i>1</i>次，最高：<i>58</i>, <i class="err">不及格</i></span>
                  </div>
                </li>
              </ul>
              <div class="content_more">
                <router-link to="">
                  <p>查看更多<i class="icon_left_arrow"></i></p>
                </router-link>
              </div>
            </div>
          </div>
          <div class="m_home_content content_2">
            <div class="m_home_content_title">
              <h2>名师直播</h2>
              <p>12位老师正在讲课</p>
            </div>
            <div class="live_wrap border-wrap" >
              <router-link to="./shop/commodity?id=100000">
                <div class="live_wrap_title">
                  <h2>英语中级课程</h2>
                  <p>巩固英语基础，找到更高突破点</p>
                </div>
                <div class="live_wrap_info ">
                  <div class="live_wrap_info_left">
                    <div class="live_wrap_info_avater">
                      <img src="" alt="" srcset="">
                    </div>
                    <span>willam</span>
                  </div>
                  <div class="live_wrap_info_right">
                    <p><i>¥</i>500.00</p>
                    <span>2699人报名</span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </m-srcoll>
  </div>
</template>
<script>
  import {Swiper} from 'vux'
  import utils from '@/utils'
  export default {
    components: {
      Swiper
    },
    created() {
      this.$vux.loading.hide()
    },
    data() {
      return {
        navList: [
          [
            {
              title: '如何上课',
              icon: 'rhsk',
              link: true,
              href: './wwc'
            },
            {
              title: '名校课程',
              icon: 'mxkc',
              link: true,
              href: './wwc'
            },
            {
              title: '名校真题',
              icon: 'mxzt',
              link: false,
              href: 'paperList'
            },
            {
              title: '免费试听',
              icon: 'mfst',
              link: true,
              href: './audition'
            }
          ],
          [
            {
              title: '我的课程',
              icon: 'wdkc',
              link: true,
              href: './userClass'
            },
            {
              title: '我的作业',
              icon: 'wdzy',
              link: true,
              href: './userWork'
            },
            {
              title: '学情记录',
              icon: 'xqjl',
              link: true,
              href: './report'
            },
            {
              title: '邀请分享',
              icon: 'yqfx',
              link: true,
              href: './wwc'
            }
          ]
        ],
        downTrigger: null,                                                    // 下拉刷新出发容器元素
        downRefreshing: false,                                                // 下拉刷新是否在刷新状态
        bannerList: [                                                               // 轮播图列表
          {url: '', img: utils.getDprImg('/static/images/mobile/Banner.jpg')}
        ]
      }
    },
    mounted() {
    },
    methods: {
      link(e) {
        if (e.link) {
          this.$router.push(e.href)
        } else {
          this.$store.commit('CHANGE_NAV', e.href)
        }
      },
      // 下拉刷新事件
      downRefresh() {
        this.downRefreshing = true
      },
      addLesson() {
        let {get} = this.$http
        if (this.$store.state.token === '') {
          this.$store.commit('changeShowLogin')
          return
        }

        this.$vux.confirm.show({
          title: '加入班级',
          showInput: true,
          placeholder: '请输入分班码',
          onConfirm: (v) => {
            this.$vux.loading.show({
              text: '提交中'
            })
            get('/v1/student-course/join-course', {
              params: {courseCode: v}
            })
            .then(({data}) => {
              this.$vux.loading.hide()
              if (!data.status) {
                this.$vux.confirm.hide()
                this.$vux.toast.text('加入班级成功')
              } else {
                this.$vux.toast.text(data.message)
              }
            })
            .catch(() => {
              this.$vux.loading.hide()
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
@import '../../../assets/css/variable/variable.scss';
@import '../../../assets/css/mixin/mixin.scss';

.white {
  background-color: #fff;
}

.img_center {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.border-wrap {
  border-radius: 10px;
  box-shadow: 6px 12px 13px 0px rgba(217, 219, 223, 0.5);
}

.m_header_logo {
  width: 66px;
}

.transfrom-wrap {
  position: relative;
  padding: 0 16px;
  transform: translate3d(0, -33px, 1px);
  z-index: 9;
}

.m_home_banner {
  width: 100vw;
  height: 51.6025vw;
  img {
    width: 100%;
  }
}

.m_home_nav {
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  background-color: $bg_white;
  &_col {
    display: flex;
    justify-content: space-around;
    &:first-child {
      margin-bottom: 30px;
    }
  }
  &_icon {
    display: block;
    margin: 0 auto;
    width: 40px;
    height: 30px;
    margin-bottom: 8px;
    background: url('/static/images/mobile/nav_icon.png') no-repeat;
    background-size:  165.6666px;
    &.rhsk {
      background-position: -47.33px -70.66px;
    }
    &.mxkc {
      background-position: -47.33px -106.33px;
    }
    &.mxzt {
      background-position: -47.33px -35.33px;
    }
    &.mfst {
      background-position: 0 -106.33px;
    }
    &.wdkc {
      background-position: 0 0;
    }
    &.wdzy {
      background-position: 0 -35.33px;
    }
    &.xqjl {
      background-position: 0 -70.66px;
    }
    &.yqfx {
      background-position: -47.33px 0;
    }
  }
}

.m_home_content {
  margin-top: 16px;
  padding-bottom: 0;
  background-color: $bg-white;
  &.content_2 {
    margin-top: 0;
    background-color: transparent;
  }
  &_title {
    padding: 16px;
    font-size: 18px;
    p {
      font-size: 12px;
      color: #bbbbbb;
    }
  }
  &_wrap {
    padding: 0 16px;
  }
  &_banner {
    margin-bottom: 20px;
    border-radius: 5px;
    max-height: 150px;
    box-shadow: 3px 10px 16px 2px rgba(217, 219, 223, 0.7);
    img {
      width: 100%;
    }
  }
}

.live_wrap {
  padding: 16px;
  background-color: #fff;
  &_title {
    margin-bottom: 20px;
    h2 {
      font-size: 20px;
      line-height: 34px;
    }
    p {
      font-size: 12px;
      color: #b2b2b2;
    }
  }
  &_info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    &_left {
      display: flex;
      align-items: center;
    }
    &_right {
      p {
        font-size: 22px;
        line-height: 14px;
        color: #259281;
        i {
          font-size: 14px;
        }
      }
      span {
        font-size: 12px;
        color: #b2b2b2;
      }
    }
    &_avater {
      margin-right: 15px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #ccc;
    }
  }

}

.m_home_content_list li{
  display: flex;
  margin-bottom: 7px;
}

.content_list_left {
  margin-right: 10px;
  width: 62px;
  height: 62px;
  border-radius: 10px;
  background-color: #ccc;
}

.content_list_right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  p {
    margin-bottom: 3px;
    font-size: 18px;
  }
  span {
    color: #8A8A8F;
  }
  span i {
    color: #0A60FF;
    &.err {
      color: #E22C29;
    }
    &.suc {
      color: #63D476;
    }
  }
}

.content_more {
  display: flex;
  justify-content: center;
}

.content_more p {
  position: relative;
  padding: 12px 0;
  color: $font_color_1;
  i {
    position: absolute;
    top: 50%;
    right: -16px;
    margin-top: -7px;
    width: 8px;
    height: 13px;
    background: url('/static/images/mobile/arror@2x.png') no-repeat;
    background-size: 100%;
  }
}

</style>
