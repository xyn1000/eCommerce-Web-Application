import Vue from 'vue'
import Router from 'vue-router'
import SignIn from "@/components/SignIn";
import Register from "@/components/Register";
import UserPage from "@/components/UserPage";
import ResetPwd from "@/components/ResetPwd";
import CheckOut from "@/components/CheckOut";
import SearchPage from "@/components/SearchPage";
import HomePage from "@/components/HomePage";
import ItemPage from "@/components/ItemPage";
import NotFound from "@/components/NotFound";
import activitionPage from "@/components/activitionPage";
import failActivition from "@/components/failActivition";
import resetPage from "@/components/resetPage";

const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}


Vue.use(Router)
const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/signin',
            component: SignIn,
            name: 'signin'
        },
        {
            path: '/register',
            component: Register,
            name: 'register'
        },
        {
            path: '/user',
            component: UserPage,
            name: 'user'
        },
        {
            path: '/reset',
            component: ResetPwd,
            name: 'reset'
        },
        {
            path: '/checkout',
            component: CheckOut,
            name: 'checkout'
        },
        {
            path: '/search/:searchTerm',
            component: SearchPage,
            name: 'search'
        },
        {
            path:'/',
            component:HomePage,
            name:'home'
        },

        {
            path:'/item',
            component: ItemPage,
            name:'item'
        },
        {
            path:'/activate-account',
            component:activitionPage,
            name:'activationPage'

        },
        {
            path:'/activation-failed',
            component:failActivition,
            name:'failActivation'
        },
        {
            path:'/reset-password',
            component:resetPage,
            name:'resetPage'
        },


        {
            path:'*',
            component: NotFound,
            name:"notFound"
        }


    ]
})

export default router
