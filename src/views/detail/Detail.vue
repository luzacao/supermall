<template>
  <div id="detail">
    <detail-nav-bar @titleClick="titleClick" class="detail-nav" ref="nav"></detail-nav-bar>
    <ul>
      <li v-for="item in $store.state.cartList">
        {{item.count}}
      </li>
    </ul>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages" ref="base"/>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="itemparams" ref="param"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
      <toast :message="message" :show="show"></toast>
  </div>

</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo"
  import DetailParamInfo from "./childComps/DetailParamInfo"
  import DetailCommentInfo from "./childComps/DetailCommentInfo"
  import DetailBottomBar from "./childComps/DetailBottomBar"

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from 'components/content/goods/GoodsList'
  import BackTop from 'components/content/backTop/BackTop'
  import Toast from 'components/common/toast/Toast'

  import {mutations} from '../../store/mutations.js'
  import {message,indexstore} from '../../store/index.js'

  import {backTopMixin} from "@/common/mixin"; 
  import {BACKTOP_DISTANCE} from "common/const";
  import { getDetail, Goods, Shop, GoodsParam, getRecommend } from "network/detail";
  export default {
    name: "Detail",
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        itemparams: {},
        commentInfo: {},
        recommends: [],
        themeTopYs:[],
        getThemeTopY:null,
        currentIndex:0,
        isShowBackTop: false,
        message:'',
        show:false
      };
      
    },
    created() {
      //1.保存传入ID
      this.iid = this.$route.params.iid;
      //2.根据Id请求数据
      getDetail(this.iid).then(res => {
        const data = res.result; 
        //2.获取顶部信息
        this.topImages = data.itemInfo.topImages;
        //3.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);
        //4.创建店铺信息
        this.shop = new Shop(data.shopInfo);
        //5.保存商品详情数据
        this.detailInfo = data.detailInfo;
        //6.获取参数信息
        this.itemparams = new GoodsParam(data.itemParams.info, data.itemParams.rule);
        //7.取出评论信息
        if (data.rate.cRate != 0) {
          this.commentInfo = data.rate.list[0]

        }

      });
      //3.请求推荐数据
      getRecommend().then(res => {
        // console.log(res)
        this.recommends = res.data.list

      })

    },

    methods: {
      //滚动到顶部小箭头
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 300)
      },
      imageLoad() {
        this.$refs.scroll.refresh()
        // let newRefresh=debouce(thsi.$refs.scroll.refresh,100)
        // newRefresh()
        // this.getThemeTopY()
        // console.log("1");
        
      
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        console.log(this.themeTopYs);
        
       
      },
      titleClick(index){
        console.log(index); 
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100)
      },
      //监听滚动主题
      contentScroll(position) {
        // 获取y值
        const positionY=-position.y
        //positionY和主题中值进行对比
        let length=this.themeTopYs.length
          for (let i = 0; i < length-1; i++) {
          if(this.currentIndex!==i&&(positionY>=this.themeTopYs[i]&&positionY<this.themeTopYs[i+1])){
            this.currentIndex=i
            this.$refs.nav.currentIndex=this.currentIndex
          }
           
          }
    //是否回到底部
    
        //1.判断Backtop是否显示
        this.isShowBackTop = (-position.y) > 1000
        //2.决定tabControl是否吸顶(position:fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop

          
      },
      toastShow(q){
        this.show=true;
        this.message=message();
       
        setTimeout(() => {
          this.show=false;
          this.message="";
        }, 1000);
        // console.log(q);
      },
      addToCart(){
        //获取商品信息
        const product={}
        product.message=''
        product.image=this.topImages[0]
        product.title=this.goods.title
        product.desc=this.goods.desc
        product.checked=true
        product.price=this.goods.realPrice
        product.iid=this.iid
        // console.log($store.state.cartList.count);
        //将商品加入购物车
        
        this.$store.commit('addCart',product)
        this.toastShow(product)
        // this.addCart(product)
        // mutations(this.$store.state,product)
        
        
      }


    },
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      GoodsList,
      BackTop,
      Scroll,
      Toast
    },
    
  };
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 1;
    background-color: #fff;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 60px;
  }
</style>