import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/home'
import field from '@/pages/field'
import detail from '@/pages/detail'
import contact from '@/pages/contact'
import Article_details from '@/pages/Article_details'
import picture_details from '@/pages/picture_details'




Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/field',
      name: 'field',
      component: field
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail
    },
    {
      path: '/contact',
      name: 'contact',
      component: contact
    },
    {
      path: '/Article_details:id',
      name: 'Article_details',
      component: Article_details
    },
    {
      path: '/picture_details:id',
      name: 'picture_details',
      component: picture_details
    },
  ]
})
