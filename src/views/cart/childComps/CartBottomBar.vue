<template>
    <div class="bottom-bar">
        <div class="check-content">
        <check-button :checked="isSelectAll" class="check-button" @check="bottomChecked"></check-button>
        <span>全选</span>
    </div>
    <div class="price">
        合计:{{totalPrice}}
    </div>
    <div class="calculate">
        去计算({{checkLength}}) 
    </div>
</div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton"
export default {
    name:'CartBottomBar',
    components: {
      CheckButton
    },    

    computed:{
        totalPrice(){
            return '￥'+this.$store.state.cartList.filter(item =>{
                // console.log(this.$store.state.cartList);
                return item.checked
            }).reduce((preValue,item) => {
                // console.log(1); 
                return preValue+item.price*item.count
            },0)
        },
        checkLength(){
            return this.$store.state.cartList.filter(item => item.checked).length
        },
        isSelectAll(){
            if (this.$store.state.cartList.length==0) {
                return false 
            }
            // return !(this.$store.state.cartList.filter(item => !item.checked).length)
            return !(this.$store.state.cartList.find(item => !item.checked))//遍历到不选中的就停下来返回
            
        
    }
},
methods:{
    bottomChecked(){
        if(this.isSelectAll){
            this.$store.state.cartList.forEach(item => item.checked=false)
        }else{//部分或全部不选中
            this.$store.state.cartList.forEach(item => item.checked=true)
        }
    },
    checkBtnClick () {
        // 1.判断是否有未选中的按钮
        let isSelectAll = this.$store.getters.cartList.find(item => !item.checked);

        // 2.有未选中的内容, 则全部选中

      }
}
}
</script>

<style scoped>
        .bottom-bar{
        position: relative;
        display: flex;

        height: 40px;
        line-height: 40px;
        font-size: 14px;

        background-color: #eee;
    }
    .check-content{
        display: flex;
        align-items: center;
        
    }

    .check-button{
        width: 20px;
        height: 20px;
        line-height: 20px;
    }
    .price{
        margin-left: 20px;
    }
    .calculate{
        width: 100px;
        margin-left: auto;

        text-align: center;

        background-color: red;
        color: #fff;
    }
</style>