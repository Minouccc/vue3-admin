import axios from 'axios'
import { useCookies } from '@vueuse/integrations/useCookies'
import { ElNotification } from 'element-plus'
const service = axios.create({
    baseURL: '/api',
})// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const cookie = useCookies()
    const token = cookie.get("admin-token")
    if(token){
        config.headers["token"] = token
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response.data.data;
  }, function (error) {
     ElNotification({
        message: error.response.data.msg || '请求失败',
        type: 'error',
        duration: 3000
        })
        return Promise.reject(error);
  }); 
export default service