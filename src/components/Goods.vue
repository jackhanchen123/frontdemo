<template>
	<li>
		<div class="good_img">
			<img :src="Image" />
		</div>
		<div class="good_desc">{{Name}} 价格:{{Price}}</div>
		<div class="good_add">
			<el-button type="danger" @click="addToShoppingCar(id)">加入购物车</el-button>
		</div>
	</li>
</template>

<script>
	export default {
		props: {
			id: Number,
			Image: String,
			Name: String,
			Price: Number
		},
		methods: {
			addToShoppingCar(id) {
				// console.log(id);
				this.$http({
					method: "get",
					url: "/card/addbuygoods",
					baseURL: this.$server,
					params: {
						buygoodid: id
					}
				}).then(response => {
					if (response.data) { //T
						console.log(response.data)
						this.$router.push("/newhome/buycar")
					}
				}).catch()
			}
		}
	}
</script>

<style scoped>
	.good_img {
		padding-top: 10px;
		margin-bottom: 15px;
		width: 316px;
		height: 305px;
		overflow: visible;
	}

	.good_desc {
		margin-bottom: 5px;
		height: 30px;
		line-height: 30px;
		font-size: 20px;
	}

	.good_add {
		height: 30px;
		line-height: 30px;
		margin-bottom: 10px;
	}
</style>
