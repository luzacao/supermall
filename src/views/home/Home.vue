<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <home-swiper :banners="banners" />
    <home-recommed-view :recommends="recommends"/>
    <feature-view/>  
    <tab-control :titles="['流行','新款','经典']"/>

  </div>
</template>
<script>
import HomeSwiper from "./childComps/HomeSwiper";
import HomeRecommedView from "./childComps/HomeRecommendsView";
import FeatureView from './childComps/FeatureView'

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl"

import {getHomeMultidata,getHomeGoods} from "network/home";
export default {
  name: "Home",
  components: {
    HomeSwiper,
    HomeRecommedView,
    FeatureView,
    NavBar,
    TabControl
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods:{
        'pop':{page:0,list:[]},
        'new':{page:0,list:[]},
        'sell':{page:0,list:[]},
      }
    };
  },
  created() {
    //1.请求多个数据
      this.getMultidata(),
    //2.请求商品数据
      this.getGoods('pop')
      this.getGoods('new')
      this.getGoods('sell')
 },
 methods: {
   getMultidata(){
      getHomeMultidata().then(res => {
      // console.log(res)
      this.banners = res.data.banner.list;
      this.recommends = res.data.recommend.list;
    })
    },
     getGoods(type){
        const page=this.goods[type].page+1
      getHomeGoods(type,page).then(res=>{
          console.log(res)
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page+=1
  })
     }
 }
};
</script>
<style>
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}
#home{
  padding-top: 44px;
}
</style>