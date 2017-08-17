import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import GoodsList from '@/components/goodsList.vue'
import cart from '@/components/cart.vue'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'cart',
      component: cart
    }
  ]
})
