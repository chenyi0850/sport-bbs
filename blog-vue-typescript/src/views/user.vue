<template>
  <div class="user left">
    <el-card>
      <div class="header">
        <div class="avatar">
          <img class="auth-logo" src="../assets/userLogo.jpeg" alt="作者头像" />
        </div>
        <div class="text">
          <h1>admin</h1>
          <p>这是个人介绍</p>
        </div>
        <div>
          <el-button @click="dialogVisible = true">编辑个人资料</el-button>
        </div>
      </div>
    </el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane label="我的动态" name="first"><archive /></el-tab-pane>
      <el-tab-pane label="我的帖子" name="second">我的帖子</el-tab-pane>
      <el-tab-pane label="我的收藏" name="third">我的收藏</el-tab-pane>
      <el-tab-pane label="浏览记录" name="fourth">浏览记录</el-tab-pane>
    </el-tabs>
    <el-dialog
      title="编辑个人资料"
      :width="isMobile ? '90%' : '50%'"
      :visible="dialogVisible"
      @close="handleClose"
    >
      <el-form>
        <el-formItem label="邮箱" :label-width="formLabelWidth">
          <el-input
            v-model="params.email"
            placeholder="邮箱"
            autocomplete="off"
          >
          </el-input>
        </el-formItem>
        <el-formItem label="密码" :label-width="formLabelWidth">
          <el-input
            type="password"
            placeholder="密码"
            v-model="params.password"
            autocomplete="off"
          ></el-input>
        </el-formItem>
        <el-formItem
          label="昵称"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="params.name"
            placeholder="用户名或昵称"
            autocomplete="off"
          ></el-input>
        </el-formItem>
        <el-formItem
          label="手机"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="params.phone"
            placeholder="手机号"
            autocomplete="off"
          ></el-input>
        </el-formItem>
        <el-formItem
          label="简介"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="params.desc"
            placeholder="个人简介"
            autocomplete="off"
          ></el-input>
        </el-formItem>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="success"
                 @click="handleOAuth">github 授权登录</el-button> -->
        <el-button
          :loading="btnLoading"
          type="primary"
          @click="handleOk('register')"
          >保 存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isMobileOrPc } from "@/utils/utils";
import archive from "./archive"
export default {
  components: {
    archive,
  },
  data() {
    return {
      activeName: "first",
      isMobile: isMobileOrPc(),
      dialogVisible: false,
      formLabelWidth: this.isMobile ? "40px" : "60px",
      params: {
        email: "",
        name: "",
        password: "",
        phone: "",
        desc: "",
      },
      btnLoading: false
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleClose() {
      this.dialogVisible = false
    },
  },
};
</script>

<style lang="less" scoped>
.user {
  .header {
    margin: 10px 0;
    display: flex;
    .auth-logo {
      width: 90px;
      height: 90px;
      // display: block;
      border-radius: 100%;
      margin-right: 30px;
    }
    .text {
      width: 70%;
    }
    h1 {
      margin: 0 0 10px 0;
    }
  }
  .el-tabs {
    margin-top: 20px;
  }
}
</style>