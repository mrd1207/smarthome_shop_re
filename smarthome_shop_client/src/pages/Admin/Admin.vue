<template>
  <el-container>
    <el-header height="50px">
      <div>
        <!-- <img src="../assets/heima.png" alt=""> -->
        <span>后台管理</span>
      </div>
      <el-button type="text" @click="goBack">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-btn" @click="toggleCol">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="adminActivePath">
          <el-menu-item index="/admin/admingoods" @click="saveState('/admin/admingoods')">
            <i class="el-icon-menu" ></i>
            <span slot="title">商品管理</span>
          </el-menu-item >
          <el-menu-item index="/admin/addgoods" @click="saveState('/admin/addgoods')">
            <i class="el-icon-setting"></i>
            <span slot="title">商品上架</span>
          </el-menu-item>
          <el-menu-item index="/admin/adminusers" @click="saveState('/admin/adminusers')">
            <i class="el-icon-setting"></i>
            <span slot="title">用户信息</span>
          </el-menu-item>
          <el-menu-item index="/admin/adminsales" @click="saveState('/admin/adminsales')">
            <i class="el-icon-setting"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/adminstatus" @click="saveState('/admin/adminstatus')">
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
  data() {
    return {
      isCollapse:false,
      adminActivePath: ""
    }
  },
    created() {
    this.adminActivePath = window.sessionStorage.getItem("adminActivePath");
    this.$router.push(this.adminActivePath);
  },
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
    toggleCol(){
      this.isCollapse=!this.isCollapse;
    },
    saveState(adminActivePath) {
      window.sessionStorage.setItem("adminActivePath", adminActivePath);
      this.adminActivePath = adminActivePath;
    },

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
