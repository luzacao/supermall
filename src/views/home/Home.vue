<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control class="tab-control" :titles="['流行','新款','经典']" @tabClick="tabClick" ref="tabControl1"
      v-show="isTabFixed" />
    <scroll class="content" ref="scroll" @scroll="contentScroll" @pullingUp="loadMore" :probe-type="3"
      :pull-up-load="true">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <home-recommed-view :recommends="recommends" />
      <feature-view />
      <tab-control class="tab-control" :titles="['流行','新款','经典']" @tabClick="tabClick" ref="tabControl2" />
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>
<script>
  import HomeSwiper from "./childComps/HomeSwiper";
  import HomeRecommedView from "./childComps/HomeRecommendsView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";

  import { getHomeMultidata, getHomeGoods } from "network/home";
  import { debounce } from "common/utils";
  export default {
    name: "Home",
    components: {
      HomeSwiper,
      HomeRecommedView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          pop: { page: 0, list: [] },
          new: { page: 0, list: [] },
          sell: { page: 0, list: [] }
        },
        currentType: "pop",
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
        itemImgList: null
      };
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list;
      }
    },
    destroyed() {
      console.log("home destroayed")
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 100)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      //1.保存y值
      this.saveY = this.$refs.scroll.getScrollY()
      //2.取消全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    created() {
      //1.请求多个数据
      this.getMultidata(),
        //2.请求商品数据
        this.getHomeGoods("pop");
      this.getHomeGoods("new");
      this.getHomeGoods("sell");
      //赋值
    },
    mounted() {
      //监听item中图片加载完成
      const refresh = debounce(this.$refs.scroll.refresh, 100);
      //对我们监听的事件进行保存
      this.itemImgListener = () => {
        newRefresh(20, 30, 'abc')
      }
      this.$bus.$on("itemImageLoad", this.itemImgListener)
    },
    methods: {
      /**
       * 事件监听的方法
       */

      contentScroll(position) {
        //1.判断Backtop是否显示
        this.isShowBackTop = (-position.y) > 1000
        //2.决定tabControl是否吸顶(position:fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType);
        console.log("上拉加载");
      },
      swiperImageLoad() {
        //获取tabControl的offsetTop
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = "pop";
            break;
          case 1:
            this.currentType = "new";
            break;
          case 2:
            this.currentType = "sell";
            break;
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0);
      },
      /**
       * 网络请求相关的方法
       */

      getMultidata() {
        getHomeMultidata().then(res => {
          // console.log(res)
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        });
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;

          this.$refs.scroll.finishPullUp();
        });
      }
    }
  };
</script>
<style scoped>
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
  }

  .tab-control {
    background-color: #fff;
    position: relative;
    /* top: 44px; */
    z-index: 9;
  }

  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;

  }

  /* .fixed{
  position: fixed;
  left: 0;
  right: 0; 
  top: 44px;
} */
</style>