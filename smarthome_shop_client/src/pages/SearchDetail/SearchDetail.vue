<template>
  <div>
    <div id="container">
      <div class="product">
        <div class="pro_show" v-if="searchResults.length">
          <ProductItem v-for="(goods) in searchResults" :key="goods.goods_id" :pro="goods"/>
        </div>
        <div v-else>
          找不到您想要的商品{{searchResults}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import ProductItem from '../../components/ProductItem/ProductItem'

  export default {
    components: {
      ProductItem
    },
    computed: {
      ...mapState(['searchResults']),
    },
    methods:{
      goDetail(id){
        this.$router.replace('/goods/' + id);
      },
    },
  }
</script>

<style scoped>


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
</style>
