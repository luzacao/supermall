import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
//1.安装vuex
Vue.use(Vuex)
let message1=""
export function message() {

    return message1
} 
    

//2.创建Store
const store=new Vuex.Store({
    state:{
        cartList:[]
    },
    getters,
    mutations,
    actions,
     mutations:{
         addCart(state,payload){
            //payload新添加的商品
            // let oldProduct=null;
            // for (let item of state.cartList) {
            //     if(item.iid==payload.iid){
            //         oldProduct=item;
            //     }
            // }
            let oldProduct=state.cartList.find(item => item.iid==payload.iid)
            //2.判断oldProduct
            if(oldProduct){
                
                oldProduct.count+=1
                message1="数量加一"
                // console.log(oldProduct);
            }else{
                payload.count = 1
                state.cartList.push(payload)
                // oldProduct.message="已添加"
                message1="已添加"
            }
        }
    }
})
//3.挂在vue实例上
export default store