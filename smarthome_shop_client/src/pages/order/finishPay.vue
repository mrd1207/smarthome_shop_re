<template>
  <div id="finish_pay">
    <div class="finish">支付成功！</div>
    <div class="finish">还有{{timecounts}}秒自动跳转至首页</div>
    <el-button type="text" @click="goHome('/home')">点击跳转至首页</el-button>
  </div>
</template>

<script>
export default {
  data(){
    return {
      timecounts:5
    }
  },
  created(){
    let timer=setInterval(()=>{
      this.timecounts--;
      if(this.timecounts==0){
        clearInterval(timer);
        this.$router.replace('/home');
      }
    },1000);
  },
  methods:{
    goHome(path){
      this.$router.replace(path);
    }
  }
}
</script>

<style scoped>
  #finish_pay{
    width: 95%;
    height: 100px;
    background-color: turquoise;
    border: 1px green solid;
    margin: 30px auto;
  }
  .finish{
    margin: 10px;
  } 
</style>