import axios from "~/axios";

export function login(username,password){
    return axios.post("/admin/login",{
        username,
        password
    })   
}
export function getInfo(){
    return axios.post("/admin/getinfo")
}

export function logout(){
    return axios.post("/admin/logout")
}