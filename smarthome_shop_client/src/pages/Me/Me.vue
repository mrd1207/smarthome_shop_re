<template>
  <el-container>
    <el-header>
      <div>
        <!-- <img src="../assets/heima.png" alt=""> -->
        <span>个人中心</span>
      </div>
      <el-button type="primary" size="medium" @click="goBack">退出</el-button>
    </el-header>
    <el-container>
      <el-aside>
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="1" @click="goTo('/me/profile')">
            <i class="el-icon-menu" ></i>
            <span slot="title">个人信息</span>
          </el-menu-item >
          <el-menu-item index="3" @click="goTo('/me/editpwd')">
            <i class="el-icon-setting"></i>
            <span slot="title">安全中心</span>
          </el-menu-item>
          <el-menu-item index="4" @click="goTo('/me/collection')">
            <i class="el-icon-setting"></i>
            <span slot="title">我的收藏</span>
          </el-menu-item>
          <el-menu-item index="5" @click="goTo('/me/adminaddress')">
            <i class="el-icon-setting"></i>
            <span slot="title">收货地址</span>
          </el-menu-item>
          <el-menu-item index="6" @click="goTo('/me/sales')">
            <i class="el-icon-setting"></i>
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
  data() {},
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

  }
};
</script>

<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
}
.el-header span {
  font-size: 30px;
}
.el-container {
  height: 100%;
}
.el-aside {
  background-color: #333;
  width: 200px;
}
.el-button {
  align-self: center;
  height: 45px;
}
</style>
