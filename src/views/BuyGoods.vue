<template>
  <el-container class="home">
	  <ul class="glist">
		  <!--使用子组件-->
		   <Goods v-for="(item,index) in goodslist" :key="index" 
			:Image="item.goodsImg" :Name="item.goodsName" :Price="item.goodsPrice"  :id="item.goodsId">
		   </Goods>
	  </ul>
  </el-container>
</template>

<script>
// @ is an alias to /src
import Goods from "@/components/Goods.vue"; //引入子组件

export default {
  data(){
	// const item={
	// 	img:require("../assets/huawei.png"),
	// 	name:"华为",
	// 	price:6666
	// }
	return{
		// goodslist:Array(16).fill(item)
		goodslist:""
	}  
  },
  methods:{
	  load() { //加载主页面封装为方法便于调用
	  	const vm = this //获取当前Vue实例
	  	this.$http({
	  			method: "get",
	  			url: "/card/listgoods",
	  			baseURL: vm.$server
	  		})
	  		.then(response => {
	  	// 		console.log(response.data)
	  	  		this.goodslist = response.data
				// [{"goodsId":132,"goodsName":"华为","goodsPrice":8888.0,"goodsNumber":100,"goodsTypeid":1,"goodsImg":"http://127.0.0.1:9000/goods/ff51da747f2d4586be8677816c04bc2a.png"},
				//{"goodsId":133,"goodsName":"华为","goodsPrice":8888.0,"goodsNumber":100,"goodsTypeid":1,"goodsImg":"http://127.0.0.1:9000/goods/c715c3bb227c4b2cb0363231cd307bf7.png"},
				//{"goodsId":134,"goodsName":"华为","goodsPrice":8888.0,"goodsNumber":100,"goodsTypeid":1,"goodsImg":"http://127.0.0.1:9000/goods/4df4ff97dbd641ce8f08e8627605d18d.png"},
				//{"goodsId":135,"goodsName":"华为","goodsPrice":8888.0,"goodsNumber":100,"goodsTypeid":1,"goodsImg":"http://127.0.0.1:9000/goods/ce123f1eb92f47f9bed25a561ef3873a.png"}]
	  		})
	  		.catch(error => console.log(error))
	  }	
  },  
  components: {
    Goods //注册子组件
  },
  created() {
  	this.load()
  }  
};
</script>
<style>
	.glist li{
		display: block;
		float:left;
	}
</style>
