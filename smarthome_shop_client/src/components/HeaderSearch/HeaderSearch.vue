<template>
  <div class="header_container">
    <div class="header_search">
      <h2>智能家居商城</h2>
      <img class="title-img" src="../../common/img/logo-round.png" />
      <div class="search">
        <el-input type="text" placeholder="搜索" v-model="keywords" class="search_input"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="postSearch" size="medium">搜索</el-button>
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
/*头部搜索区*/
.header_container {
  position: relative;
  /* width: 100%; */
  height: 140px;
  margin: 0;
  padding: 0;
  background-color: white;
  
}
/*商城标识图片区域*/
/* .header_container > .header_img {
  position: absolute;
  left: 100px;
  margin-top: 10px;
  width: 140px;
  height: 140px;
  border: 1px solid darkgray;
  box-shadow: 2px 4px 15px rgba(45, 45, 45, 0.15);
  border-radius: 50%;
} */
/* .header_img > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
} */
/*鼠标移入图片实现3d动画*/
/* .header_img:hover {
  transform-style: preserve-3d;
  transform: rotateY(360deg);
  transition: all 1500ms;
  -moz-transform-style: preserve-3d;
  -moz-transform: rotateY(45deg);
  -moz-transition: all 1500ms;
} */
/*pc  >=992px*/
.header_search {
  position: absolute;
  left: 50%;
  width: 80%;
  /* width: 700px; */
  /* margin-left: -290px; */
  transform: translate(-50%, 0);
  margin-top: 40px;
  display: flex;
}
.title-img {
  height: 50px;
  width: 50px;
  align-self: center;
  /* padding: 5px; */
}

.search {
  align-self: center;
}
@media screen and (min-width: 992px) {

  .search_input {
    width: 490px;
    margin-right: 10px;
  }
}
/*pad >=768px  <=991px*/
@media screen and (min-width: 768px) and (max-width: 991px) {
  
  .search_input {
    width: 300px;
    margin-right: 10px;
  }
}
/*phone <=767px*/
@media screen and (max-width: 767px) {
  .search_input {
    width: 150px;
    margin-right: 10px;
  }
  h2 {
    font-size: 18px;
  }
  .el-input__inner {
    height: 35px;
  }
}

/* .header_search button.el-button.el-button--danger {
  padding: 0;
  width: 60px;
  height: 35px;
  font-size: 18px;
  border-radius: 0;
  outline: none;

  display: flex;
  justify-content: center;
  align-items: center;
} */
/* .header_search > p > a {
  display: inline-block;
  padding: 5px 10px;
  font-size: 12px;
  color: #999;
  cursor: pointer;
}
.header_search > p > a:hover {
  color: red;
} */
/*头部的购物车标记区域*/
/* .header_container > .shopping_bag {
  position: absolute;
  margin-top: 60px;
  right: 120px;
  width: 190px;
  height: 35px;
  text-align: center;
  line-height: 35px;
  font-size: 12px;
  background: #f8f9fa;
  color: red;
  cursor: pointer;
} */
</style>
