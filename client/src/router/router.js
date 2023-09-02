import {createWebHistory, createRouter} from "vue-router";
import Login from "@/components/auth/Login.vue";
import Register from "@/components/auth/Register.vue";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import Profile from "@/components/profile/Profile.vue";
import UserProfile from "@/components/user/UserProfile.vue";
import EditUserProfile from "@/components/user/EditUserProfile.vue";
import Room from "@/components/room/Room.vue";
import RoomList from "@/components/room/RoomList.vue";
import NotFound from "@/components/error/NotFound.vue";
import {checkUserData} from "@/helpers/user";
import _ from 'lodash'
import store from "@/store/store";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            requiresAuth: false
        }
    },

    {
        path: '/about',
        name: 'About',
        component: About,
        meta: {
            requiresAuth: false
        }
    },

    {
        path: '/login',
        name: 'Login',
        component: Login,
        props: true,
        meta: {
            requiresAuth: false
        }
    },

    {
        path: '/register',
        name: 'Register',
        component: Register,
        props: true,
        meta: {
            requiresAuth: false
        }
    },

    {
        path: '/profile/:handle',
        name: 'Profile',
        component: Profile,
        meta: {
            requiresAuth: true,
            transitionName: 'router-anim',
            enterActive: 'animated fadeIn'
        }
    },

    {
        path: '/user/:handle',
        name: 'UserProfile',
        component: UserProfile,
        props: true,
        meta: {
            requiresAuth: true,
            transitionName: 'router-anim',
            enterActive: 'animated fadeIn'
        }
    },

    {
        path: '/user/:handle/edit',
        name: 'EditUserProfile',
        component: EditUserProfile,
        props: true,
        meta: {
            requiresAuth: true,
            transitionName: 'router-anim',
            enterActive: 'animated fadeIn'
        }
    },

    {
        path: '/rooms',
        name: 'RoomList',
        component: RoomList,
        props: true,
        meta: {
            requiresAuth: true,
            transitionName: 'router-anim',
            enterActive: 'animated fadeIn'
        }
    },

    {
        path: '/room/:id',
        name: 'Room',
        component: Room,
        meta: {
            requiresAuth: true,
            transitionName: 'router-anim',
            enterActive: 'animated fadeIn'
        }
    },

    {
        path: '/:pathMatch(.*)*',
        component: NotFound
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach(async(to, from, next) => {
   await checkUserData(next);
    if(to.meta.requiresAuth) {
        if(localStorage.getItem('authToken') === null){
            localStorage.clear();
            next({
                name: 'Login',
                params: {message: 'You are unauthorized, Please login to access'}
            });
        }else if (!_.isEmpty(to.meta) && !to.meta.requiresAuth) {
            if(localStorage.getItem('authToken')) {
                next({
                    name: 'UserProfile',
                    params: {handle: store.getters.getUserData.handle}
                });
            }else{
                next();
            }
        }else {
            next()
        }
    }else{
        next()
    }
})

export default router