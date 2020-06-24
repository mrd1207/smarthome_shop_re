<template>
  <div class="header_container">
    <div class="header_search">
      <h2>S M A R T</h2>
      <div class="search">
        <el-input type="text" prefix-icon="el-icon-search" placeholder="搜索" v-model="keywords" class="search_input" ></el-input>
        <el-button plain icon="el-icon-search" @click="postSearch" size="medium">搜索</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keywords: ""
    };
  },
  methods:{
    postSearch(){
      
      if(this.keywords){
          let keywordsParam = `keywords=${this.keywords}`;
          this.$store.dispatch('reqSearch',keywordsParam).then(res=>{
            
            this.$store.commit('setSearchResults',res.data.message);
          });
          this.$router.replace('/searchdetail');
        }
    }
  }
  
};
</script>
<style scoped>
.el-button {
  border-radius: 0px;
  font-weight: 300;
  font-size: 16px;
  height: 40px;
}
/*头部搜索区*/
.header_container {
  /* position: relative; */
  /* width: 100%; */
  height: 140px;
  margin: 0;
  padding: 0;
  background-color: white;
}
/*商城标识图片区域*/
/*pc  >=992px*/
.header_search {
  width: 820px;
  margin: 0 auto;
  margin-top: 40px;
  display: flex;
}
.header_search h2{
  font-weight: 300;
    font-size: 32px;

}
.title-img {
  height: 50px;
  width: 50px;
  align-self: center;
  /* padding: 5px; */
}

.search {
  align-self: center;
  margin-left: 30px;
}
  .search_input {
    width: 490px;
    margin-right: 30px;

  }



</style>
