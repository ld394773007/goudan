
import Router from 'vue-router'

// Router.prototype.go = function(n) {
//   this.isBack = true
//   window.history.go(n)
// }

export default new Router({
  routes: [
    {
      path: '/',
      name: '/',
      component: function(resolve) {
        require(['@/view/mobile'], resolve)
      },
      children: [
        {
          path: 'login',
          name: 'login',
          component: function(resolve) {
            require(['@/view/login'], resolve)
          }
        },
        {
          path: 'home',
          name: '/home',
          component: function(resolve) {
            require(['@/view/mobile/index/index.vue'], resolve)
          }
        },
        {
          path: 'feedback',
          name: 'feedback',
          component: function(resolve) {
            require(['@/view/mobile/user/feedback'], resolve)
          }
        },
        {
          path: 'editUser',
          name: 'editUser',
          component: function(resolve) {
            require(['@/view/mobile/user/editUser'], resolve)
          }
        },
        {
          path: 'editInput',
          name: 'editInput',
          component: function(resolve) {
            require(['@/view/mobile/user/editInput'], resolve)
          }
        },
        {
          path: 'editPassword',
          name: 'editPassword',
          component: function(resolve) {
            require(['@/view/mobile/user/editPassword'], resolve)
          }
        },
        {
          path: 'userClass',
          name: 'userClass',
          component: function(resolve) {
            require(['@/view/mobile/user/class'], resolve)
          }
        },
        {
          path: 'userOrder',
          name: 'userOrder',
          component: function(resolve) {
            require(['@/view/mobile/user/order'], resolve)
          }
        },
        {
          path: 'userMic',
          name: 'userMic',
          component: function(resolve) {
            require(['@/view/mobile/user/micro'], resolve)
          }
        },
        {
          path: 'userWork',
          name: 'userWork',
          component: function(resolve) {
            require(['@/view/mobile/user/work'], resolve)
          }
        },
        {
          path: 'playClass',
          name: 'playClass',
          component: function(resolve) {
            require(['@/view/mobile/playClass'], resolve)
          }
        },
        {
          path: 'testPaper',
          name: 'testPaper',
          component: function(resolve) {
            require(['@/view/mobile/testPaper'], resolve)
          }
        },
        {
          path: 'paper',
          name: 'paper',
          component: function(resolve) {
            require(['@/view/mobile/paper'], resolve)
          }
        },
        {
          path: 'paperResult',
          name: 'paperResult',
          component: function(resolve) {
            require(['@/view/mobile/paperResult'], resolve)
          }
        },
        {
          path: 'report',
          name: 'report',
          component: function(resolve) {
            require(['@/view/mobile/report'], resolve)
          }
        },
        {
          path: 'playMic',
          name: 'playMic',
          component: function(resolve) {
            require(['@/view/mobile/playMic'], resolve)
          }
        },
        {
          path: 'audition',
          name: 'audition',
          component: function(resolve) {
            require(['@/view/mobile/huodong/audition'], resolve)
          }
        },
        {
          path: 'wwc',
          name: 'wwc',
          component: function(resolve) {
            require(['@/view/mobile/wwc'], resolve)
          }
        },
        {
          path: 'shop',
          name: 'shop',
          component: function(resolve) {
            require(['@/view/shop'], resolve)
          },
          children: [
            {
              path: 'commodity',
              component: function(resolve) {
                require(['@/view/shop/commodity'], resolve)
              }
            },
            {
              path: 'list',
              component: function(resolve) {
                require(['@/view/shop/list'], resolve)
              }
            },
            {
              path: 'user-order',
              component: function(resolve) {
                require(['@/view/shop/userOrder'], resolve)
              }
            },
            {
              path: 'user-order-detail',
              component: function(resolve) {
                require(['@/view/shop/userOrderDetail'], resolve)
              }
            },
            {
              path: 'user-course',
              component: function(resolve) {
                require(['@/view/shop/userCourse'], resolve)
              }
            },
            {
              path: 'user-work',
              component: function(resolve) {
                require(['@/view/shop/userWork'], resolve)
              }
            },
            {
              path: 'user-parents',
              component: function(resolve) {
                require(['@/view/shop/userParents'], resolve)
              }
            },
            {
              path: 'order',
              component: function(resolve) {
                require(['@/view/shop/order'], resolve)
              }
            },
            {
              path: 'pay',
              component: function(resolve) {
                require(['@/view/shop/payment'], resolve)
              }
            },
            {
              path: 'success',
              component: function(resolve) {
                require(['@/view/shop/success'], resolve)
              }
            }
          ]
        }
      ]
    }
  ]
})
