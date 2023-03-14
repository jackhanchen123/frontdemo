<template>
	<el-container id="home">
		<el-header>
			<el-dropdown>
				<i class="el-icon-setting" style="margin-right: 15px"></i>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item @click.native="dialogVisible = true">修改密码</el-dropdown-item>
					<el-dropdown-item @click.native="quit()">退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<span>欢迎: {{userName}}</span>

			<!-- 弹窗表单 -->
			<el-dialog title="修改密码" :visible.sync="dialogVisible">
				<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="原密码" prop="oldPass">
						<el-input v-model.number="ruleForm.originPass" @blur="checkoldpasswd()"></el-input>
					</el-form-item>
					{{errorMsg}}					
					<el-form-item label="密码" prop="pass">
						<el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="checkPass">
						<el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
					</el-form-item>
												
					<el-form-item>
						<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
						<el-button @click="resetForm('ruleForm')">重置</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</el-header>
		<el-container>
			<el-aside width="200px" style="background-color: rgb(238, 241, 246)">
				<el-menu :default-openeds="['1']">
					<el-submenu index="1">
						<template slot="title"><i class="el-icon-message"></i>管理模块1</template>
						<el-menu-item-group>
							<el-menu-item index="1-1">
								<!-- <router-link to="/home/student">学生管理</router-link> -->
								<a href="#" @click.prevent="stumain()">商品列表</a>
							</el-menu-item>
							<el-menu-item index="1-2">
								<router-link to="/newhome/buycar">购物车</router-link>
							</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
					<el-submenu index="2">
						<template slot="title"><i class="el-icon-menu"></i>管理模块2</template>
						<el-menu-item-group>
							<el-menu-item index="2-1">选项1</el-menu-item>
							<el-menu-item index="2-2">选项2</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title"><i class="el-icon-setting"></i>管理模块3</template>
						<el-menu-item-group>
							<el-menu-item index="3-1">选项1</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-container>
				<!-- <router-view></router-view> -->
				<router-view :key="$route.path+$route.query.time"></router-view>
			</el-container>
		</el-container>
	</el-container>
</template>
<script>
	export default {
		data() {
			// var checkoldpasswd = (rule, value, callback) => {
			// 	if (!value) {
			// 		return callback(new Error('密码不能为空'));
			// 	}
			// };
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				ruleForm: {
					pass: '',
					checkPass: '',
					originPass: ''
				},
				errorMsg:"",
				userName: "",
				userpasswd: "",
				dialogVisible: false,
				formLabelWidth: '120px',
				rules: { //规则
					pass: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					checkPass: [{
						validator: validatePass2,
						trigger: 'blur'
					}]
					// oldPass: [{
					// 	validator: checkoldpasswd,
					// 	trigger: 'blur'
					// }]
				}
			};
		},
		methods: {
			open1() {
				this.$notify({
					title: '修改密码成功',
					type: 'success'
				});
			},
			open2() {
				this.$notify({
					title: '已退出！',
					type: 'success'
				});
			},
			checkoldpasswd() {
				this.$http({
					method: "get",
					url: "/card/checkStuOldPasswd",
					baseURL: this.$server,
					params: {
						old: this.ruleForm.originPass
					}
				}).then(Response => {
					if (Response.data) {//T
						this.errorMsg = ""
					} else(
						this.errorMsg = "原密码错误！"						
					)
				}).catch()

			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						alert('submit!');
						this.$http({
							method: "get",
							url: "/card/submitStuPasswd",
							baseURL: this.$server,
							params: {
								newpasswd: this.ruleForm.checkPass								
							}
						}).then(Response=>{
							if(Response.data){
								this.dialogVisible=false,
								this.open1(),
								this.$router.push("/")
							}
							
						}
						
						).catch()
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			stumain() { //链接跳转到商品购物页面
				this.$router.push({
					path: "/newhome/buygoods",
					query: {
						time: Date.now()
					}
				})
			},
			quit() {
				this.$http({
					url: "/card/quit",
					baseURL: this.$server,
					method: "get"
				}).then(response => {
					console.log(response.data),
						this.open2(),
						this.$router.push("/")
				}).catch()
			}
		},
		created() {
			const vm = this; //获取当前组件的vue实例
			this.$http({
				method: "get",
				url: "/card/stuname",
				baseURL: vm.$server
			}).then( //成功回调
				function(response) {
					//console.log(response)
					vm.userName = response.data.stuLogin
					vm.userpasswd = response.data.stuPasswd
				}
			).catch( //失败回调
				error => (console.log(error))
			)
		}
	}
</script>
<style scoped>
	#home {
		font-family: Helvetica, sans-serif;
		width: 1200px;
		margin: 0px auto;
	}

	.el-header,
	.el-footer {
		background-color: #303133;
		color: #333;
		text-align: center;
		line-height: 60px;
		color: #409EFF;
	}

	.el-header {
		text-align: right;
	}

	.el-aside {
		background-color: #D3DCE6;
		color: #333;
		text-align: left;
		line-height: 40px;

	}

	.el-menu-item {
		line-height: 40px;
	}

	.el-main {
		background-color: #F2F6FC;
		color: #333;
		text-align: center;
		line-height: 40px;
	}

	.el-table {
		margin: 10px 0px 22px;
	}

	a {
		text-decoration: none;
	}

	/*导航超链接点击之后的样式则是router-link-active*/
	.router-link-active {
		text-decoration: none;
	}

	.login-box {
		border: 1px solid #DCDFE6;
		width: 350px;
		margin: 180px auto;
		padding: 35px 35px 15px 35px;
		border-radius: 5px;
		-webkit-border-radius: 5px;
		-moz-border-radius: 5px;
		box-shadow: 0 0 25px #909399;
	}
</style>
