<template>
  <el-container>
    <el-header height="50px">
      <div>
        <!-- <img src="../assets/heima.png" alt=""> -->
        <span>个人中心</span>
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
          :default-active="activePath"
        >
          <el-menu-item index="/me/profile" @click="saveState('/me/profile')">
            <i class="el-icon-document"></i>
            <span slot="title">个人信息</span>
          </el-menu-item>
          <el-menu-item index="/me/editpwd" @click="saveState('/me/editpwd')">
            <i class="el-icon-setting"></i>
            <span slot="title">安全中心</span>
          </el-menu-item>
          <el-menu-item index="/me/collection" @click="saveState('/me/collection')">
            <i class="el-icon-collection-tag"></i>
            <span slot="title">我的收藏</span>
          </el-menu-item>
          <el-menu-item index="/me/adminaddress" @click="saveState('/me/adminaddress')">
            <i class="el-icon-location"></i>
            <span slot="title">收货地址</span>
          </el-menu-item>
          <el-menu-item index="/me/sales" @click="saveState('/me/sales')">
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
      isCollapse: false,
      activePath: ""
    };
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
    this.$router.push(this.activePath);
  },
  methods: {
    goBack() {
      this.$router.push("/home");
    },
    saveState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
    toggleCol() {
      this.isCollapse = !this.isCollapse;
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
.el-menu-vertical-demo {
  border: 0px solid;
}
.toggle-btn {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
