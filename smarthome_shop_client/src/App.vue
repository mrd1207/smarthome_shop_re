<template>
  <div id="app">
    <HeaderTop class="headertop" v-show="$route.meta.showHeaderTop" />
    <HeaderSearch v-show="$route.meta.showHeaderSearch" />
    <!-- <keep-alive> -->
    <router-view v-if="isRouterAlive"></router-view>
    <!-- </keep-alive> -->
    <footerdetail v-show="$route.meta.showFooterDetail"></footerdetail>

  </div>
</template>

<script>
import HeaderTop from "./components/HeaderTop/HeaderTop";
import HeaderSearch from "./components/HeaderSearch/HeaderSearch";
import footerdetail from "../src/components/Footer/footer"
export default {
  name: "app",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  mounted() {
    let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    if (userInfo) {
      this.$store.state.userInfo = userInfo;
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  },
  components: {
    HeaderTop,
    HeaderSearch,
    footerdetail
  }
};
</script>

<style>
#app {
  height: 100%;
  /* position: relative; */
  list-style: none;
  background-color: #fcfcfc;
}
/* .headertop{
  
} */
</style>
