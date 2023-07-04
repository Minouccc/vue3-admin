import {createStore} from 'vuex'
import { getInfo,login } from '~/api/manager'
import { setToken,removeToken } from '~/composables/auth'

const store = createStore({
    state() {
       return{
           user:{},
           asideWidth: "250px",
           menus:[],
           ruleNames:[] 
        }
    },
    mutations: {
        SET_USERINFO(state, user){
            state.user = user
        },
        handleAsideWidth(state){
            state.asideWidth = state.asideWidth === "250px" ? "64px" : "250px"
        },
        SET_MENUS(state, menus){
            state.menus = menus
        },
        SET_RULENAMES(state, ruleNames){
            state.ruleNames = ruleNames
        }
    },
    actions: {
        login({commit}, {username, password}){
            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    setToken(res.token)
                    commit("")
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },  
        getInfo({commit}){
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    commit('SET_MENUS', res.menus)
                    commit('SET_RULENAMES', res.ruleNames)
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