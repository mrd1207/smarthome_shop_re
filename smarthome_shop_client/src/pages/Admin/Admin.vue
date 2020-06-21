<template>
  <el-container>
    <el-header>
      <div>
        <!-- <img src="../assets/heima.png" alt=""> -->
        <span>后台管理</span>
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
          <el-menu-item index="1" @click="goTo('/admin/admingoods')">
            <i class="el-icon-menu" ></i>
            <span slot="title">商品管理</span>
          </el-menu-item >
          <el-menu-item index="3" @click="goTo('/admin/addgoods')">
            <i class="el-icon-setting"></i>
            <span slot="title">商品上架</span>
          </el-menu-item>
          <el-menu-item index="4" @click="goTo('/admin/adminusers')">
            <i class="el-icon-setting"></i>
            <span slot="title">用户信息</span>
          </el-menu-item>
          <el-menu-item index="5" @click="goTo('/admin/adminsales')">
            <i class="el-icon-setting"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
          <el-menu-item index="6" @click="goTo('/admin/adminstatus')">
            <i class="el-icon-setting"></i>
            <span slot="title">统计</span>
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
      this.$confirm("是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("AdminLoginOut").then(res => {
          if (res.data.success_code == 200) {
            // let result = this.logOut({});
            window.localStorage.removeItem("adminInfo");
            this.$message({
              type: "success",
              message: "已退出登录!"
            });
            this.$router.push("/home");
          } else {
            this.$message.error("退出失败");
          }
        });
      });
      
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
