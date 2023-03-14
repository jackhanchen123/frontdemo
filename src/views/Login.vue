<template>
  <div>
    <el-form ref="loginForm" :model="stu" :rules="rules" label-width="80px" class="login-box">
      <h3 class="login-title">欢迎登录</h3>
      <el-form-item label="账号" prop="stuname">
        <el-input type="text" placeholder="请输入账号" v-model="stu.stuname" />
      </el-form-item>
      <el-form-item label="密码" prop="stupassword">
        <el-input type="password" placeholder="请输入密码" v-model="stu.stupassword" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="onSubmit('loginForm')">登录</el-button>
        <span style="color:#f56c6c;margin-left:1.25rem;">{{ errorMsg }}</span>
      </el-form-item>
    </el-form>
    <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%">
      <span>请输入账号和密码</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      stu: {
        stuname: '',
        stupassword: ''
      },
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        stuname: [
          { required: true, message: '账号不可为空', trigger: 'blur' }
        ],
        stupassword: [
          { required: true, message: '密码不可为空', trigger: 'blur' }
        ]
      },
      // 对话框显示和隐藏
      dialogVisible: false,
      errorMsg: ""
    }
  },
  methods: {
    onSubmit(formName) {
      const vm = this;//获取当前组件的vue实例
      // 为表单绑定验证功能
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
          //发送ajax请求,进行登录验证
          this.$http({
            method: "post",
            url: "/card/stulogin",
            data: {
              stuLogin: this.stu.stuname,
              stuPasswd: this.stu.stupassword
            },
            baseURL: this.$server
          }).then( //成功回调
            function (response) {
              //console.log(response)
              if (response.data) {
                vm.$router.push("/newhome")
              } else {
                vm.errorMsg = "用户名或者密码错误"
              }
            }
          ).catch( //失败回调
            error => (console.log(error))
          )
        } else {
          this.dialogVisible = true;
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>
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

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>

