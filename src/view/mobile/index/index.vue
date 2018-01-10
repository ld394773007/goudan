<template>
  <div class="y-mobile">
    <component :is="item.link" v-for="item in navList" v-if="item.link === activeNav" :key="item.name"></component>
    <div class="m_footer_wrap">
      <div class="m_footer">
        <a
          href="javascript:"
          @click="handleNavChange(item.link)"
          class="m_footer_btn" :class="{'active': item.link === activeNav, 'center': i === 2}"
          :key="i"
          v-for="(item, i) in navList"
        >
          <i :class="'m_footer_btn_icon ' + item.icon"></i>
          <span class="m_footer_btn_text">{{item.text}}</span>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    components: {
      home: () => import('../home'),
      openClass: () => import('../openClass'),
      live: () => import('../live'),
      user: () => import('../user'),
      paperList: () => import('../paperList')
    },
    data() {
      return {
        navList: [
          {
            link: 'home',
            icon: 'home',
            text: '首页'
          },
          {
            link: 'openClass',
            name: 'openClass',
            icon: 'gkk',
            text: '公开课'
          },
          {
            link: 'paperList',
            name: 'question',
            icon: 'lzt',
            text: '练真题'
          },
          {
            link: 'live',
            name: 'live',
            icon: 'mszb',
            text: '名师直播'
          },
          {
            link: 'user',
            name: 'user',
            icon: 'my',
            text: '我的'
          }
        ]
      }
    },
    computed: {
      activeNav() {
        return this.$store.state.activeNav
      }
    },
    mounted() {
      let mask = document.querySelector('.first-loading')
      if (mask) {
        mask.remove()
      }
    },
    methods: {
      handleNavChange(v) {
        this.$store.commit('CHANGE_NAV', v)
      }
    }
  }
</script>
<style lang="scss">
@import '../../../assets/css/variable/variable.scss';
@import '../../../assets/css/mixin/mixin.scss';

@mixin icon_boxshadow($w, $h, $shadow) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  margin: {
    top: -32px;
    left: -$w / 2;
  }
  width: $w;
  height: $h;
  border-radius: 50%;
  box-shadow: $shadow;
}

.m_footer_wrap{
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
  height: 83px;
}

.m_footer {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 83px;
  width: 100vw;
  height: 50px;
  background-color: $bg_white;
  border-top: 1px rgba(217, 219, 223, 0.5) solid;
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    margin: {
      left: -(75px / 2)
    }
    width: 75px;
    height: 75px;
    border-radius: 50%;
    background-color: $bg-white;
    border: 1px rgba(217, 219, 223, .5) solid;
    clip: rect(0 75px 34px 0);
  }
  &_btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    width: 20vw;
    height: 50px;
    &.center {
      position: relative;
      align-self: flex-start;
      padding-bottom: 7px;
      margin-top: 6px;
      height: 64px;
      transform: translateY(-34px);
      &::before {
        @include icon_boxshadow(63px, 63px, 0 2px 3px 0 #C9CCD1);
        border: 1px rgb(238, 237, 237) solid;
      }
      &::after {
        @include icon_boxshadow(70px, 70px, 1px 2px 3px 1px rgba(217, 219, 223, 0.5));
        clip: rect(65px,75px,100px, 0px)
      }
    }

    &_icon {
      display: block;
      width: 23px;
      height: 23px;
      background: url('/static/images/mobile/nav_icon.png') no-repeat;
      background-size: 153.83333px;
      &.home {
        width: 26px;
        background-position: -87.5047px 0;
      }
      &.gkk {
        background-position: -87.2047px -27.5476px;
      }
      &.lzt {
        width: 30px;
        height: 30px;
        background-position: -87.5047px -54.7857px;
      }
      &.mszb {
        background-position: -87.5047px -86.9952px;
      }
      &.my {
        background-position: -87.5047px -115.1428px;
      }
    }

    &.active {
      color: #29A193;
      .m_footer_btn_icon {
        &.home {
          background-position: -120.5142px 0;
        }
        &.gkk {
          background-position: -120.2142px -27.5476px;;
        }
        &.lzt {
          background-position: -119.9292px -54.7857px;
        }
        &.mszb {
          background-position: -120.0142px -87.4952px;
        }
        &.my {
          background-position: -120.3142px -115.1428px;
        }
      }
    }

    &_text {
      font-size: 12px;
      color: #c7c7d3;
      margin: {
        top: 2px;

      }
      .active > & {
        color: $font_color;
      }
    }
  }
}


</style>

