import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/players',
      name: 'players',
      component: () => import('./views/Players.vue')
    },
    {
      path: '/generator',
      name: 'generator',
      component: () => import('./views/Generator.vue')
    },
    {
      path: '/scorecards',
      name: 'scorecards',
      component: () => import('./views/Scorecards.vue')
    },
    {
      path: '/scoreboard',
      name: 'scoreboard',
      component: () => import('./views/Scoreboard.vue')
    },
  ]
})
