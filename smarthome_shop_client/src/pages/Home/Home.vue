<template>
  <div id="home">
    <!--轮播图-->
    <el-carousel v-if="homecasual.length > 0" :height="bannerHeight+'px'">
      <el-carousel-item v-for="(casual) in homecasual" :key="casual.id">
        <img :src="casual.imgurl" class="casualImg" />
      </el-carousel-item>
    </el-carousel>
    <el-divider>商品分类</el-divider>
    <div class="cate_style">
      <el-row :gutter="5">
        <el-col :span="8" v-for="(item) in category" :key="item">
          <el-card :body-style="{ padding: '20px' }" class="cardStyle" shadow="hover">
            <img
              :src="item.cate_img"
              class="image"
               @click="goCate(item.cate_id)"
            />
            <div class="bottom">
              <el-button type="text" class="cateBtn" @click="goCate(item.cate_id)">{{item.cate_name}}</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-divider>猜你喜欢</el-divider>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      bannerHeight: 500
    };
  },
  created() {
    // dispatch调用action函数
    this.$store.dispatch("getHomecasual");
    this.$store.dispatch("getCategory").then(res => {
        // commit是将data传给mutations
       this.$store.commit('setCategory', res.data.message);
      });
  },
  computed: {
    ...mapState(["homecasual", "category"])
  },
  methods: {
    goCate(cate_id){
      this.$router.replace('/category/' + cate_id + '/1');

    }
  }
};
</script>

<style scoped>
.casualImg {
  /* width: 100%; */
}
.cate_style {
  margin-top: 0px;
  padding: 10px;
}

.bottom {
  margin-top: 0px;
  line-height: 12px;
  padding: 0px;
  text-align: center;
}

.cateBtn {
  padding: 0;
  float: center;
  color: black;
  font-size: 30px;
}
.cardStyle{
  margin-top: 0px;
  border:0px solid white;
}
.image {
  width: 100%;
  display: block;
}
@media screen and (min-width: 992px) {

}
@media screen and (min-width: 768px) and (max-width: 991px) {
  .cateBtn {
  font-size: 21px;
}
}
/*phone <=767px*/
@media screen and (max-width: 767px) {
.cateBtn {
  font-size: 12px;
}
}
</style>
