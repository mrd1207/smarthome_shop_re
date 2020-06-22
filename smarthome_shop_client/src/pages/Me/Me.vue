<template>
  <el-container>
    <el-header height="50px">
      <div>
        <!-- <img src="../assets/heima.png" alt=""> -->
        <span>个人中心</span>
      </div>
      <el-button type="text"  @click="goBack">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-btn" @click="toggleCol">|||</div>
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false">
          <el-menu-item index="1" @click="goTo('/me/profile')">
            <i class="el-icon-document" ></i>
            <span slot="title">个人信息</span>
          </el-menu-item >
          <el-menu-item index="3" @click="goTo('/me/editpwd')">
            <i class="el-icon-setting"></i>
            <span slot="title">安全中心</span>
          </el-menu-item>
          <el-menu-item index="4" @click="goTo('/me/collection')">
            <i class="el-icon-collection-tag"></i>
            <span slot="title">我的收藏</span>
          </el-menu-item>
          <el-menu-item index="5" @click="goTo('/me/adminaddress')">
            <i class="el-icon-location"></i>
            <span slot="title">收货地址</span>
          </el-menu-item>
          <el-menu-item index="6" @click="goTo('/me/sales')">
            <i class="el-icon-menu"></i>
            <span slot="title">我的订单</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse:false
    }
  },
  methods: {
    goBack() {
      this.$router.push("/home");
    },
    handleOpen(){

    },
    handleClose(){

    },
    goTo(path){
        this.$router.replace(path);
    },
    toggleCol(){
      this.isCollapse=!this.isCollapse;
    }

  }
};
</script>

<style scoped>
.el-header {
  background-color: #333;
  color: white;

  line-height: 50px;
  display: flex;
  justify-content: space-between;
  
}
.el-header span {
  font-size: 24px;
}
.el-container {
  height: 100%;
}
.el-aside {
  background-color: #333744;

}
.el-button {
  align-self: center;
  height: 45px;
}
.el-menu-vertical-demo{
  border:0px solid;
}
.toggle-btn{
  background-color:#4A5064 ;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
