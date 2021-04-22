<template>
  <div class="user left" :class="{ 'user-mobile': isMobile }">
    <el-card>
      <div class="header">
        <div class="avatar">
          <img
            class="auth-logo"
            :src="userInfo.avatar === 'user' ? defaultImg : userInfo.avatar"
            alt="用户头像"
          />
        </div>
        <div class="text">
          <h1>{{ userInfo.name }}</h1>
          <p>
            {{ userInfo.introduce }}
          </p>
          <el-button @click="dialogVisible = true">编辑个人资料</el-button>
        </div>
      </div>
    </el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane label="我的动态" name="first" :lazy="true"
        ><archive
      /></el-tab-pane>
      <el-tab-pane label="我发布的" name="second" :lazy="true">
        <my-published :type="'1,5,13'" />
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="third" :lazy="true"
        ><my-published :type="'2,6,9'"
      /></el-tab-pane>
      <el-tab-pane label="浏览记录" name="fourth" :lazy="true"
        ><my-published :type="'12'"
      /></el-tab-pane>
    </el-tabs>
    <el-dialog
      title="编辑个人资料"
      :width="isMobile ? '90%' : '50%'"
      :visible="dialogVisible"
      @close="handleClose"
    >
      <el-form>
        <el-formItem label="头像" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="`api/uploadAvatar?_id=${params._id}`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="imageUrl"
              :src="params.avatar === 'user' ? defaultImg : params.avatar"
              class="edit-avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-formItem>
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
            show-password
          ></el-input>
        </el-formItem>
        <el-formItem label="昵称" :label-width="formLabelWidth">
          <el-input
            v-model="params.name"
            placeholder="用户名或昵称"
            autocomplete="off"
          ></el-input>
        </el-formItem>
        <el-formItem label="手机" :label-width="formLabelWidth">
          <el-input
            v-model="params.phone"
            placeholder="手机号"
            autocomplete="off"
          ></el-input>
        </el-formItem>
        <el-formItem label="签名" :label-width="formLabelWidth">
          <el-input
            v-model="params.introduce"
            placeholder="个性签名"
            autocomplete="off"
          ></el-input>
        </el-formItem>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="success"
                 @click="handleOAuth">github 授权登录</el-button> -->
        <el-button :loading="btnLoading" type="primary" @click="handleOk()"
          >保 存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isMobileOrPc } from "@/utils/utils";
import archive from "./archive";
import myPublished from "@/components/myPublished";
export default {
  components: {
    archive,
    myPublished,
  },
  data() {
    return {
      activeName: "first",
      isMobile: isMobileOrPc(),
      dialogVisible: false,
      formLabelWidth: this.isMobile ? "40px" : "60px",
      params: {
        _id: "",
        avatar: "",
        email: "",
        name: "",
        password: "",
        phone: "",
        introduce: "",
      },
      userInfo: {},
      btnLoading: false,
      imageUrl: "",
      defaultImg: require("../assets/user.png"),
    };
  },
  methods: {
    handleClick(tab, event) {},
    handleClose() {
      this.dialogVisible = false;
    },

    handleAvatarSuccess(res, file) {
      this.params.avatar = URL.createObjectURL(file.raw);
      this.imageUrl = URL.createObjectURL(file.raw);
      // window.localStorage.setItem("userInfo", {
      //   _id: this.params._id,
      //   name: this.params.name,
      //   avatar: this.params.avatar,
      //   introduce: this.params.introduce,
      //   phone: this.params.phone,
      // });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    async handleOk() {
      const reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      ); //正则表达式
      if (!this.params.email) {
        // Message.warning("邮箱不能为空！");
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
      }
      if (!this.params.password) {
        this.$message({
          message: "密码不能为空！",
          type: "warning",
        });
        return;
      } else if (!this.params.name) {
        this.$message({
          message: "用户名不能为空！",
          type: "warning",
        });
        return;
      }
      const re = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      if (this.params.phone && !re.test(this.params.phone)) {
        this.$message({
          message: "请输入正确的手机号!",
          type: "warning",
        });
        return;
      }
      if (this.params.introduce.length > 132) {
        this.$message({
          message: "个性签名太长啦!",
          type: "warning",
        });
        return;
      }
      this.btnLoading = true;
      const data = await this.$https.post(this.$urls.updateUser, this.params);
      console.log(data);
      this.btnLoading = false;

      const userInfo = {
        _id: data._id,
        name: data.name,
        avatar: data.avatar,
        introduce: data.introduce,
        phone: data.phone,
      };
      // console.log(userInfo);
      this.$store.commit("SAVE_USER", {
        userInfo,
      });
      window.localStorage.userInfo = JSON.stringify(userInfo);
      this.$message({
        message: "保存成功",
        type: "success",
      });
      this.userInfo = JSON.parse(JSON.stringify(this.params));
      this.dialogVisible = false;
    },
  },
  created() {
    this.userInfo = JSON.parse(window.localStorage.userInfo);
    this.params = JSON.parse(JSON.stringify(this.userInfo));
    this.imageUrl = this.userInfo.avatar;
    if(this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
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
  // 上传头像
  /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/ .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 90px;
    height: 90px;
    line-height: 90px;
    text-align: center;
  }
  .edit-avatar {
    width: 90px;
    height: 90px;
    display: block;
  }
  // 上传头像结束
}
.user-mobile {
  /deep/ .el-tabs__item {
    padding: 0 15px;
  }
  /deep/ .el-card__body {
    padding: 10px;
  }
}
</style>