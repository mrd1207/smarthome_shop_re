<template>
  <div id="edit-pwd">
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="修改密码" name="first">
      <el-form :rules="rules" ref="ruleForm">
      <el-input placeholder="请输入原密码" prop="oriPwd" v-model="oriPwd" show-password clearable></el-input>
    <el-input placeholder="请输入新密码" prop="newPwd" v-model="newPwd" show-password clearable></el-input>
    <el-input placeholder="请再次输入新密码" prop="newPwd2" v-model="newPwd2" show-password clearable></el-input>
    </el-form>
    <p>若没有设置初始密码，则不必输入原密码</p>
    <div class="btn-section">
       <el-button type="primary" @click="goTo('/me/profile')">返回</el-button>
       <el-button type="danger" @click="submitEdit">编辑</el-button>
    </div>
    </el-tab-pane>
    <el-tab-pane label="修改手机号" name="second">
      修改手机号
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    data(){
      return{
        activeName: 'first',
        oriPwd: '',
        newPwd: '',
        newPwd2: '',
         rules: {
          name: [
            { required: true, message: '请输入原密码', trigger: 'blur' },
          ],
          newPwd: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
          ],
         newPwd2: [
            { required: true, message: '请输入原密码', trigger: 'blur' },
          ],
         }
      }
    },
    computed: {
      ...mapState(["userInfo"])
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      goTo(path){
        this.$router.replace(path);
      },
      submitEdit(){
        if(!this.newPwd || !this.newPwd2){
          this.$message('输入框内容不得为空！');
          return;
        }
        if(this.newPwd != this.newPwd2){
          this.$message('两次输入的新密码不一致！');
          return;
        }
        let updatePwd=`id=${this.userInfo.id}&oriPwd=${this.oriPwd}&newPwd=${this.newPwd}`

         this.$store.dispatch("changeUserPwd",updatePwd).then(res=>{
           console.log(res.data.success_code);
           if(res.data.success_code === 200){
            this.$confirm('修改成功是否重新登录？', '提示', {
          confirmButtonText: '去登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch("reqLogOut").then(code => {
          if (code == 200) {
            window.localStorage.removeItem("userInfo");
            this.$router.replace('/login'); 
          } else {
            this.$message.error("退出失败");
          }
        });
        }).catch(() => {
          this.$router.replace('/me/profile');        
        });
          
        }else{
          this.$message.error("修改失败");
        }
         });
        
      }
    }
  }
</script>

<style scoped>
  #edit-pwd{
    padding-top: 10%;
    width: 100%;
    height: 100%;
  }
  .el-input{
    display: block;
    margin: 0 auto 20px;
    width: 30%;
  }
  p{
    margin-top: 40px;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #999;
  }
  .btn-section{
    margin: 50px auto;
    width: 25%;

    display: flex;
    justify-content: space-between;
  }
  .btn-section .el-button{
    width: 100px;
    outline: none;
  }
</style>
