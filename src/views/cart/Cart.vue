<template>

    <div id="cart">
      <nav-bar class="nav-bar">
        <div slot="center">购物车({{cartLength}})</div>
      </nav-bar>
      <cart-list></cart-list>
      <cart-bottom-bar></cart-bottom-bar>
    </div>
  
</template>
<script>
     import NavBar from "components/common/navbar/NavBar";
     import cartList from "./childComps/CartList.vue"
     import CartBottomBar from "./childComps/CartBottomBar.vue"
     import {mapGetters} from 'vuex'
     import {mutations} from '../../store/mutations.js'
  export default {
    name:'Cart',
    components:{
       NavBar,
       cartList,
       CartBottomBar
    },
    computed:{
      ...mapGetters(['cartLength','cartList'])
    }
    
}
</script>
<style scoped>
.nav-bar{
  background-color: var(--color-tint);
  color: #fff ;
}
</style>