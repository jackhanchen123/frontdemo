<template>
	<el-main>
		<!-- <el-table :data="tableData" border show-summary style="width: 80%"> -->
		<el-table :data="tableData" border style="width: 80%" stripe ref="multipleTable" tooltip-effect="dark"
		 @selection-change="handleSelectionChange">
			<!--勾选框-->
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column prop="goods.goodsName" label="商品名称" width="130" align="center" sortable>
			</el-table-column>
			<el-table-column prop="goods.goodsImg" label="商品图片" width="130" align="center">
				<template slot-scope="scope">
					<el-image style="width: 100px; height: 100px" :src="scope.row.goods.goodsImg"></el-image>
				</template>
			</el-table-column>
			<el-table-column prop="goods.goodsPrice" label="单价" width="130" align="center">
			</el-table-column>
			<el-table-column prop="goods.goodsNumber" label="购买数量" width="200" align="center" sortable>
				<template slot-scope="scope">
					<el-input-number v-model="scope.row.buygoodsBuynumber" @change="handleChange(scope.row)" :min="1" :max="scope.row.goods.goodsNumber"
					 label="描述文字">
					</el-input-number>
				</template>
			</el-table-column>

			<el-table-column prop="res" label="小计" align="center" width="180" sortable>
				<template slot-scope="scope">
					<!-- {{scope.row.buygoodsBuynumber*scope.row.goods.goodsPrice}} -->
					<!-- <el-input>{{scope.row.buygoodsBuynumber*scope.row.goods.goodsPrice}}</el-input> -->
					<!-- <el-input v-model="result"></el-input> -->
					<span>{{scope.row.buygoodsBuynumber*scope.row.goods.goodsPrice}}</span>
				</template>
			</el-table-column>
			<el-table-column label="移除" width="100" align="center">
				<template slot-scope="scope">
					<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteBuygoods(scope.row.goods.goodsId)">移除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 合计 -->
		<el-col :span="5" class="grid">
			<span>合计：{{sum}}</span>
		</el-col>
		<br />

		<!--提交按钮-->
		<el-col :span="1" class="grid">
			<el-button type="success" icon="el-icon-circle-plus-outline" size="mini" round @click="submitCar()">提交订单</el-button>
		</el-col>

		<!--全删按钮-->
		<el-col :span="5" class="grid">
			<el-button type="danger" icon="el-icon-delete" size="mini" round @click="deleteCarAll()">全删</el-button>
		</el-col>

		<!--弹窗-->
		<el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%">
			<span>请勾选数据</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</el-main>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				//buygoodsBuynumber: 11 
				//buygoodsStuid: null
				// goods: Object
				// goodsId: 132
				// goodsImg: "http://localhost:9000/goods/5e36a0ef5b1845a6b42ea0a62f95d9ce.jpg"
				// goodsName: "华为"
				// goodsNumber: 100
				// goodsPrice: 1111
				// goodsTypeid: 1
				// input: '',
				multipleSelection: [],
				dialogVisible: false,
				//buyGoodsIds: [],
				buynum: "",
				result: "",
				res: "",
				list: []
			};
		},
		computed: {
			sum() {
				const arry = this.multipleSelection.map(function(item) {
					return item = item.goods.goodsPrice * item.buygoodsBuynumber
				})
				console.log(arry) //[7777, 6666]
				arry.filter(function() {})
				let sum = 0
				arry.map(item => {
					sum += item
				})
				return sum
			}
		},
		methods: {
			handleSelectionChange(val) { //处理多选
				this.multipleSelection = val;
				console.log(this.multipleSelection)
			},
			handleChange(row) { //处理数量
				console.log(row.buygoodsBuynumber)
				console.log(row.goods.goodsPrice)
				this.result = row.buygoodsBuynumber * row.goods.goodsPrice
				console.log(this.result)
			},
			addstu() {
				if (this.multipleSelection.length > 0) {
					let ids = this.multipleSelection.map(element => element.shoppingId)
					console.log(ids)
					this.$http({
						method: "post",
						data: this.$qs.stringify({
							ids: ids,
							allmoney: this.allmoney
						}, {
							indices: false
						}),
						url: "/card/showAlipay",
						baseURL: this.$server
					}).then(response => {
						console.log(response)
						document.querySelector('body').innerHTML = response.data; //查找到当前页面的body，将后台返回的form替换掉他的内容
						document.forms[0].submit()
					}).catch(error => console.log(error))
				}
			},
			deleteBuygoods(id) {
				console.log("要移除的商品id：" + id)
				this.$http({
					method: "get",
					url: "/card/deleteBuyGoods",
					baseURL: this.$server,
					params: {
						deleteid: id
					}
				}).then(Response => {
					this.tableData = Response.data
				}).catch()
			},
			deleteCarAll() {
				if (this.multipleSelection.length > 0) {
					this.$http({
						method: "post",
						url: "/card/deletecarall",
						baseURL: this.$server,
						data: this.multipleSelection.map(item => { //[132, 133, 134]
							return item.goods.goodsId
						})
					}).then(res => {
						//console.log("删除全部返回的数据："+res.data)
						this.tableData = res.data
					}).catch()
				} else {
					this.dialogVisible = true
				}
			},
			submitCar() { //提交订单到支付宝		
				console.log(this.multipleSelection)
				this.$http({
					method: "get",
					// url:"/card/submit",
					// baseURL: this.$server,
					url:"/order/alipay",
					baseURL: this.$pay,
					params: {
						ids: this.multipleSelection.map(item => {
							return item.goods.goodsId
						}).toString(),
						// amount: this.sum.toString(),
						// WIDout_trade_no:123,
						// WIDsubject:this.multipleSelection[0].goods.goodsName,
						// WIDbody:this.multipleSelection[0].goods.goodsName
						outTradeNo:"123",
						subject:this.multipleSelection[0].goods.goodsName,
						totalAmount: this.sum.toString(),
						body:this.multipleSelection[0].goods.goodsName
					}
				}).then(response=>{
					console.log(response)
					document.querySelector('body').innerHTML = response.data; //查找到当前页面的body，将后台返回的form替换掉他的内容
					document.forms[0].submit()
				}
					
				).catch()
			}

			// getSummaries(param) {
			// 	const {
			// 		columns,
			// 		data
			// 	} = param;
			// 	const sums = [];
			// 	columns.forEach((column, index) => {
			// 		if (index === 0) {
			// 			sums[index] = '总价';
			// 			return;
			// 		}
			// 		const values = data.map(item => Number(item[column.property]));
			// 		if (!values.every(value => isNaN(value))) {
			// 			sums[index] = values.reduce((prev, curr) => {
			// 				const value = Number(curr);
			// 				if (!isNaN(value)) {
			// 					return prev + curr;
			// 				} else {
			// 					return prev;
			// 				}
			// 			}, 0);
			// 			sums[index] += ' 元';
			// 		} else {
			// 			sums[index] = '--';
			// 		}
			// 	});
			// 	return sums;
			// }
		},
		created() {
			// let id=this.$route.params.buyGoodsId
			//this.buyGoodsIds[0] = this.$route.params.buyGoodsId
			// this.buyGoodsIds[1]="134"
			//console.log(this.buyGoodsIds) //133			
			const vm = this //获取当前Vue实例
			this.$http({
					method: "get",
					url: "/card/listbuygoods",
					baseURL: vm.$server
				})
				.then(response => {
					console.log(response.data)
					this.tableData = response.data
				})
				.catch(error => console.log(error))
		}
	};
</script>
