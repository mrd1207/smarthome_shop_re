<template>
  <div v-if="category.length">
    <div id="container">
      <!-- 分类选项 -->
      <div class="product">
          <span v-text="this.category[this.currentCate-1].cate_name"></span>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              更多类别
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(cate, index) in newcate"
                :key="index"
                :command="index+1"
              >{{ cate.cate_name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </div>
      <!-- 商品列表 -->
      <div class="pro_show">
        <ProductItem
          class="pro"
          v-for="(goods) in recommendshoplist"
          :key="goods.goods_id"
          :pro="goods"
        />
      </div>
      <!-- 页码 -->
      <div class="footer">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="activeIndex"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="category[currentCate - 1].cate_counts"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ProductItem from "../../components/ProductItem/ProductItem";

export default {
  data() {
    return {
      activeIndex: 1, // 当前页码
      currentCate: 1, // 当前分类
      pageSize: 12
    };
  },
  components: {
    ProductItem
  },
  computed: {
    ...mapState(["category", "recommendshoplist"]),
    newcate() {
      return this.category.slice(0, this.category.length - 1);
    },
    catePages() {
      let arr = [];
      this.category.forEach((cate, index) => {
        console.log("cate.cate_counts: ", cate.cate_counts);

        let page = Math.ceil(cate.cate_counts / this.pageSize);

        arr.push(page);
      });
      return arr;
    }
  },
  created() {
    this.currentCate = Number(this.$route.params.id);
    this.activeIndex = Number(this.$route.params.pageNo);
    console.log("this.activeIndex: ", this.activeIndex);
    // 请求分类数据
    this.$store.dispatch("getCategory").then(res => {
      // commit是将data传给mutations
      this.$store.commit("setCategory", res.data.message);
    });
    // 请求当前页码的商品
    this.$store.dispatch("getRecommendShopList", {
      category: this.currentCate,
      pageNo: this.activeIndex,
      count: this.pageSize
    });
  },
  methods: {
    // 分类的下拉菜单
    handleCommand(command) {
      let cateObj = {
        category: command,
        pageNo: 1,
        count: this.pageSize
      };
      this.$store.dispatch("getRecommendShopList", cateObj);

      this.$router.replace("/category/" + command + "/1");
      this.currentCate = command;
      this.activeIndex = 1;
    },
    handleCurrentChange(index) {
      // 点击按钮1，2，3...时候就是index，把index传到后端来显示对应的数据
      this.$store.dispatch("getRecommendShopList", {
        category: this.currentCate,
        pageNo: index
      });
      this.activeIndex = index;
      this.$router.replace(
        "/category/" + this.currentCate + "/" + this.activeIndex
      );
    }
  }
};
</script>

<style scoped>
/* 头部分类 */
.product {
  margin: 20px auto;
  width: 1000px;
  height: 50px;
  line-height: 50px;
  font-size: 26px;
  font-family: sans-serif;
}
.el-dropdown {
    display: inline-block;
    color: #409eff;
    font-size: 21px;
    margin-left: 20px;
}

.el-icon-arrow-down {
  font-size: 12px;
}

/* 商品列表 */
.pro_show {
  display: flex;
  flex-wrap: wrap;
  margin: 20px auto;
  width: 1000px;
}
.pro_show > .pro {
  float: left;
  margin-right: 20px;
  width: 21%;
  height: 320px;
}

/* 页码 */
.footer {
  margin: 0px auto;
  margin-bottom: 30px;
  width: 1000px;
}







</style>
