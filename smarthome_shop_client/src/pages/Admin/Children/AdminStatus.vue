<template>
  <div>
    <div id="main" style="width: 800px;height: 600px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapState } from "vuex";
export default {
  data(){
    return {
      option : {
            title: {
                text: '商品分类统计'
            },
            tooltip: {},
            legend: {
                data:['各分类数量']
            },
            xAxis: {
                data: ["智能客厅","智能卧室","智能厨房","智能卫浴","智能门厅"]
            },
            yAxis: {},
            series: [{
                name: '商品数量',
                type: 'bar',
                data: [0, 0, 0, 0, 0]
            }]
        }
    }
  },
  mounted(){
    let myChart = echarts.init(document.getElementById('main'));
    this.$store.dispatch("getCategory").then(res => {
        this.$store.commit('setCategory', res.data.message);
    })
    for (let i = 0; i < this.category.length-1; i++) {
      this.option.series[0].data[i]=this.category[i].cate_counts;
    }
    myChart.setOption(this.option);
  },
  computed:{
    ...mapState(["category"])
  }
}
</script>

<style scoped>
  /* #main{
    background-color: antiquewhite;
  } */
</style>