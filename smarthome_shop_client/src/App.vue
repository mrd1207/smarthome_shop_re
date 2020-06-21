<template>
  <div id="app">
    <HeaderTop class="headertop" v-show="$route.meta.showHeaderTop"/>
    <HeaderSearch v-show="$route.meta.showHeaderSearch"/>
    	<keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import HeaderTop from './components/HeaderTop/HeaderTop'
  import HeaderSearch from './components/HeaderSearch/HeaderSearch'
export default {
  name: 'app',

    mounted(){
      let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      if(userInfo){
        this.$store.state.userInfo=userInfo;

      }
    },
    components:{
      HeaderTop,
      HeaderSearch
    },
}
</script>

<style>
#app {
    height: 100%;
    /* position: relative; */
	list-style: none;
  background-color: #fcfcfc; 
}
/* .headertop{
  position: absolute;
} */
</style>
