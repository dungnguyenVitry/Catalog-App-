import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Catalog from '../views/Catalog.vue'
const routes = [
    {
        path:'/login', 
        name:'home',
        component: Home
    },
    {
        path: '/catalog',
        name: 'Catalog',
        component: Catalog
      }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;