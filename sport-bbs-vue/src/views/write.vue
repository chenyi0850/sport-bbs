<template>
  <div class="write">
    <el-tabs
      tab-position="top"
      :style="isMobileOrPc ? '' : 'height: 730px'"
      v-model="activeName"
      type="border-card"
    >
      <el-tab-pane label="发布帖子" name="first" :lazy="true">
        <write-article
          :isShare="false"
          v-if="articleDetLoad"
          :articleDetail="articleDetail"
        />
      </el-tab-pane>
      <el-tab-pane label="上传视频" name="second" :lazy="true">
        <el-select v-model="videoType" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-upload
          class="avatar-uploader"
          :data="dataObj"
          :action="`api/uploadVideo?user_id=${user_id}&type=${videoType}`"
          list-type="picture-card"
          :show-file-list="false"
          :on-error="handleError"
          :on-success="handleSuccessVideo"
          :on-progress="uploadProcess"
          :before-upload="videoBeforeUpload"
          :on-remove="handleRemove"
        >
          <video
            v-if="imageUrl.length > 1 && imgFlag == false"
            controls="controls"
            :src="[qiniuUrl + '/' + imageUrl]"
            class="avatar"
          ></video>
          <i
            v-else-if="imageUrl.length < 1 && imgFlag == false"
            class="el-icon-plus avatar-uploader-icon"
          ></i>
          <el-progress
            v-if="imgFlag == true"
            type="circle"
            :percentage="percent"
            style="margin-top: 20px"
          ></el-progress>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="分享装备" name="third" :lazy="true"
        ><write-article
          :isShare="true"
          v-if="articleDetLoad"
          :articleDetail="articleDetail"
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import WriteArticle from "@/components/writeArticle.vue";
import { isMobileOrPc } from "@/utils/utils";
import { warn } from "node_modules/vue-class-component/lib/util";
// import WE from 'wangeditor'

@Component({
  components: {
    WriteArticle,
  },
})
export default class Write extends Vue {
  isMobileOrPc: boolean = isMobileOrPc();
  activeName = "";
  user_id = JSON.parse(window.localStorage.userInfo)._id;
  qiniuUrl: string = "https://up.demoworld.com/"; // 个人七牛访问前缀
  imgFlag: boolean = false;
  imageUrl: string = "";
  percent: number = 0;
  dialogImageUrl: string = "";
  dialogVisible: false;
  listObj: object = {};
  dataObj: object = {
    token:
      "111o8CXprRY-dhCawNZM7LQMNs-4y1pEmUlzbuMExv9:Xqu54BdpgEykaYpZf4IKGJQpaNc=:eyJzY29wZSI6ImIyZXJwIiwiZGVhZGxpbmUiOjE1NjAyMTkxMDB9",
  }; // 此处七牛token写成常量方便调试，正式环境需要获取token
  articleDetail: object = {};
  articleDetLoad: boolean = false;
  handleRemove(file: any, fileList: any) {
    this.imageUrl = "";
  }
  handleSuccessVideo(response: any) {
    if (response.message === "保存成功") {
      this.$message.success("视频上传成功！");
      // this.imgFlag = false;
      // this.percent = 0;
      this.$https.post(this.$urls.addTimeAxis, {
        user_id: this.user_id,
        title: response.data.name,
        title_id: response.data._id,
        coverSrc: response.data.coverSrc,
        content: response.data.src,
        type: 5,
      });
      return;
    }
    if (response.code === 1) {
      this.imgFlag = false;
      this.percent = 0;
      this.$message.error("登录过期，请重新登录");
      return;
    }
    this.imgFlag = false;
    this.percent = 0;
    if (response.hash) {
      this.imageUrl = response.hash;
    } else {
      this.$message.error("视频上传失败，请重新上传！");
    }
  }
  handleError(err: any, file: any, fileList: any) {
    // 上传失败异常处理
    const error = JSON.parse(JSON.stringify(err));
    this.$message.error(error.status.toString());
    this.imgFlag = false;
    this.percent = 0;
  }
  videoBeforeUpload(file: any) {
    if(!this.videoType) {
      this.$message.warning("请选择视频类型");
      return false;
    }
    const _self = this;
    const isVideo =
      file.type === "video/mp4" ||
      file.type === "video/ogg" ||
      file.type === "video/flv" ||
      file.type === "video/avi" ||
      file.type === "video/wmv" ||
      file.type === "video/rmvb";
    const isLt30M = file.size / 1024 / 1024 < 30;
    if (!isVideo) {
      this.$message.warning("请上传正确格式的视频！");
      return false;
    } else {
      if (!isLt30M) {
        this.$message.warning("上传视频文件大小不能超过 30MB!");
        return false;
      }
    }
  }
  uploadProcess(event: any, file: any, fileList: any) {
    this.imgFlag = true;
    this.percent = Math.floor(event.percent);
  }
  private options: object = [
    {
      value: "1",
      label: "篮球",
    },
    {
      value: "2",
      label: "足球",
    },
    {
      value: "3",
      label: "田径",
    },
    {
      value: "4",
      label: "其他"
    }
  ];
  private videoType: string = "";

  async created(): Promise<void> {
    if (!this.user_id) {
      this.$message({
        type: "warning",
        message: "登录才能发帖，请先登录！",
        duration: 1000
      });
      this.$router.go(-1);
      return;
    }
    if(window.localStorage.userInfo) {
      this.$https.get(this.$urls.userInfo)
    }
    if (this.$route.query.share) {
      this.activeName = "third";
    } else {
      this.activeName = "first";
    }
    if (this.$route.query.article_id) {
      const data: any = await this.$https.post(this.$urls.getArticleDetail, {
        id: this.$route.query.article_id,
      });
      this.articleDetail = data;
      this.articleDetLoad = true;
      // console.log(this.articleDetail)
      if (data.type === 3) {
        this.activeName = "third";
      } else {
        this.activeName = "first";
      }
    }
    this.articleDetLoad = true;
  }
}
</script>

<style lang="less" scoped>
.write {
  width: 100%;
  // 上传视频
  .el-select {
    width: 178px;
    margin-bottom: 10px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
  }
  /deep/ .el-upload--picture-card {
    width: 178px;
    height: 178px;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .image-preview {
    width: 178px;
    height: 178px;
    position: relative;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    float: left;
  }

  .image-preview .image-preview-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .image-preview .image-preview-wrapper img {
    width: 100%;
    height: 100%;
  }

  .image-preview .image-preview-action {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
    cursor: pointer;
    text-align: center;
    line-height: 200px;
  }

  .image-preview .image-preview-action .el-icon-delete {
    font-size: 32px;
  }

  .image-preview:hover .image-preview-action {
    opacity: 1;
  }
}
</style>