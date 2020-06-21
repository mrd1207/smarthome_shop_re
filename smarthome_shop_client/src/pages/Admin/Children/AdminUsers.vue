<template>
  <div id="admin-users">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="用户ID">
      </el-table-column>
      <el-table-column
        prop="user_name"
        label="账号">
      </el-table-column>
      <el-table-column
        prop="user_phone"
        label="手机">
      </el-table-column>
      <el-table-column
        prop="user_nickname"
        label="昵称">
      </el-table-column>
      <el-table-column
        prop="user_address"
        label="住址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        tableData: []
      }
    },
    mounted(){
      this.getUsers();
    },
    methods: {
      getUsers(){
        this.$store.dispatch("getAllUser").then(res=>{
          if(res.data.success_code === 200){
          this.tableData = res.data.message;
        }else{
          this.$message.error("获取用户数据失败");
        }
        })
        
      }
    }
  }
</script>

<style scoped>

</style>
