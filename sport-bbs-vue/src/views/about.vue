<template>
  <div class="message left">
    <p>
      本项目采用前后端分离的形式，前端采用MVVM的设计思想，具体页面采用组件化的思想进行开发，选择Vue.js开发框架结合TypeScript进行开发，页面UI采用ElementUI组件，前端页面通过Vue-Router构成一个SPA（Single
      Page Web
      Application，单页面Web应用）。后端采用基于Node.js的Express框架进行开发，通过Express中间件完成网络路由请求的处理以及数据库的处理，前后端通过Axios进行通信。
    </p>
    <p>
      项目包括用户模块、新闻模块、论坛模块、视频模块、装备模块、发帖模块、关于模块、侧边栏模块以及移动端的适配。
    </p>
    <p>给开发者留言：</p>
    <el-form
      :model="params"
      status-icon
      :rules="rules"
      ref="params"
      label-width="50px"
      class="demo-ruleForm"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input
          type="text"
          placeholder="必填"
          v-model="params.email"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="params.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="名字" prop="name">
        <el-input v-model="params.name"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input
          type="textarea"
          placeholder="必填"
          v-model="params.content"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="submit"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { MessageParams, RulesItem, Rules } from "@/types/index";

const check = (
  rule: any,
  value: string | any,
  callback: Function | any
): any => {
  if (!value) {
    return callback(new Error("邮箱不能为空"));
  }
};
// const checkPhone = (
//   rule: any,
//   value: string | any,
//   callback: Function | any
// ): any => {
//   if (!value) {
//     return callback(new Error("手机不能为空"));
//   }
// };
// const checkName = (
//   rule: any,
//   value: string | any,
//   callback: Function | any
// ): any => {
//   if (!value) {
//     return callback(new Error("名字不能为空"));
//   }
// };
const checkContent = (
  rule: any,
  value: string | any,
  callback: Function | any
) => {
  if (!value) {
    return callback(new Error("内容不能为空"));
  }
};

@Component({})
export default class Message extends Vue {
  // initial data
  private btnLoading: boolean = false;
  private cacheTime: number = 0; // 缓存时间
  private times: number = 0; // 留言次数
  private params: any = {
    email: "",
    phone: "",
    name: "",
    content: "",
  };
  private rules: any = {
    email: [{ validator: check, trigger: "blur" }],
    // phone: [{ validator: checkPhone, trigger: "blur" }],
    // name: [{ validator: checkName, trigger: "blur" }],
    content: [{ validator: checkContent, trigger: "blur" }],
  };
  private user_id: string = window.localStorage.userInfo
    ? JSON.parse(window.localStorage.userInfo)._id
    : "";

  // use prop values for initial data

  // lifecycle hook
  mounted() {}

  // method
  private async submit(): Promise<void> {
    if (this.times > 3) {
      this.$message({
        message: "您今天留言的次数已经用完，明天再来留言吧！",
        type: "warning",
      });
      return;
    }

    let now = new Date();
    let nowTime = now.getTime();
    if (nowTime - this.cacheTime < 60000) {
      this.$message({
        message: "您留言太过频繁，1 分钟后再来留言吧！",
        type: "warning",
      });
      return;
    }

    const reg: RegExp = new RegExp(
      "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
    );
    if (!this.params.email) {
      this.$message({
        message: "邮箱不能为空！",
        type: "warning",
      });
      return;
    } else if (!reg.test(this.params.email)) {
      this.$message({
        message: "请输入格式正确的邮箱！",
        type: "warning",
      });
      return;
    } else if (!this.params.content) {
      this.$message({
        message: "内容不能为空",
        type: "warning",
      });
      return;
    }
    this.btnLoading = true;
    if (this.user_id) {
      this.params.user_id = this.user_id;
    }
    await this.$https.post(this.$urls.addMessage, this.params);
    this.btnLoading = false;

    this.times++;
    this.cacheTime = nowTime;
    this.$message({
      message: "感谢您的留言，有必要的，博主有空都会回复您的 ！",
      type: "success",
    });
    this.params.email = "";
    this.params.phone = "";
    this.params.name = "";
    this.params.content = "";
  }
}
</script>
<style scoped>
p {
  text-indent: 2em;
}
</style>
