import store from "~/store"
function hasPermission(value,el = false) {
    if(!Array.isArray(value)){
        throw new Error('you need to pass an array as the value of v-permission')
    }
    let hasAuth = value.findIndex(item => store.state.ruleNames.includes(item)) != -1
    if(el && !hasAuth){
        
        el.parentNode && el.parentNode.removeChild(el)
    }
    return hasAuth
}


export default {
    install(app) {
        app.directive('permission', {
            mounted(el, binding) {
                hasPermission(binding.value,el)
        }})
    }
}