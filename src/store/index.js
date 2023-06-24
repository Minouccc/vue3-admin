import {createStore} from 'vuex'
import { getInfo,login } from '~/api/manager'
import { setToken,removeToken } from '~/composables/auth'

const store = createStore({
    state() {
       return{
           user:{}
        }
    },
    mutations: {
        SET_USERINFO(state, user){
            state.user = user
        }
    },
    actions: {
        login({commit}, {username, password}){
            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    setToken(res.token)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },  
        getInfo({commit}){
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    commit('SET_USERINFO', res)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        logout({commit}){
            commit('SET_USERINFO', {})
            removeToken()
        }
    }
})

export default store