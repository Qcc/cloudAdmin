import Vue from 'vue'
import Router from 'vue-router'
import Overview from '../components/Overview.vue'
import Section from '../components/Section.vue'
import PushArticle from '../components/PushArticle.vue'
import ArticleManage from '../components/ArticleManage.vue'
import PushImage from '../components/PushImage.vue'
import ImageManage from '../components/ImageManage.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Overview',
      component: Overview
    },
    {
      path: '/Overview',
      name: 'Overview',
      component: Overview
    },
    {
      path: '/Section',
      name: 'Section',
      component: Section
    },
    {
      path: '/PushArticle',
      name: 'PushArticle',
      component: PushArticle
    },
    {
      path: '/ArticleManage',
      name: 'ArticleManage',
      component: ArticleManage
    },
    {
      path: '/PushImage',
      name: 'PushImage',
      component: PushImage
    },
    {
      path: '/ImageManage',
      name: 'ImageManage',
      component: ImageManage
    }
  ]
})
