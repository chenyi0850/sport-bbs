<template>
  <div class="videoDetail">
    <h2 style="text-align: center">{{ videoDetail.name }}</h2>
    <div class="player-container">
      <vue-core-video-player :src="url" :cover="cover"></vue-core-video-player>
    </div>
    <!-- <div class="heart">
      <el-button
        type="danger"
        size="large"
        icon="heart"
        :loading="isLoading"
        @click="likeVideo"
      >
        点赞
      </el-button>
      有{{ likeNum }}人觉得很赞
      <el-button
        type="danger"
        size="large"
        icon="heart"
        :loading="isLoading"
        @click="collectVideo"
      >
        收藏
      </el-button>
    </div> -->
    <div class="comment">
      <el-input
        placeholder="文明社会，理性评论"
        type="textarea"
        v-model="content"
      ></el-input>
      <el-button
        style="margin-top: 15px"
        type="primary"
        :loading="btnLoading"
        @click="handleAddComment"
        >发 送</el-button
      >
    </div>
    <CommentList
      v-if="!isLoading"
      :numbers="videoDetail.meta.comments"
      :list="videoDetail.comments"
      :article_id="videoDetail._id"
      @refreshArticle="refreshArticle"
    />

    <div
      v-if="!isMobileOrPc"
      style="width: 23%"
      class="article-right fr anchor"
      v-html="videoDetail.toc"
    ></div>
    <LoadingCustom v-if="isLoading"></LoadingCustom>
    <div id="aside">
      <el-tooltip content="点赞" placement="bottom">
        <el-badge :value="likeNum" class="item"
          ><div class="asideItem" @click="likeVideo">
            <img v-if="!isLiked" src="../assets/zan-l.png" alt="" />
            <img v-else src="../assets/zan-f.png" alt="" /></div></el-badge
      ></el-tooltip>
      <el-tooltip content="评论" placement="bottom"
        ><el-badge :value="commentNum" class="item"
          ><div class="asideItem" @click="toComment">
            <i class="el-icon-edit-outline"></i></div></el-badge
      ></el-tooltip>
      <el-tooltip content="收藏" placement="bottom"
        ><div class="asideItem" @click="collectVideo">
          <i v-if="isCollected" class="el-icon-star-on"></i
          ><i v-else class="el-icon-star-off"></i></div
      ></el-tooltip>
    </div>
  </div>
</template>

<script>
import LoadingCustom from "@/components/loading.vue";
import CommentList from "@/components/commentList.vue";
import { isMobileOrPc } from "@/utils/utils";
export default {
  components: {
    LoadingCustom,
    CommentList,
  },
  data() {
    return {
      //   url: "https://media.vued.vanthink.cn/sparkle_your_name_am720p.mp4",
      // url: "http://localhost:3000/getVideo?src=" + this.$route.query.src,
      url: "http://119.29.3.138/api/getVideo?src=" + this.$route.query.src,
      cover: this.$route.query.coverSrc,
      btnLoading: false,
      isLoading: false,
      isMobileOrPc: isMobileOrPc(),
      content: "",
      params: {
        src: this.$route.query.src,
      },
      likeTimes: 0,
      commentTimes: 0,
      likeNum: 0,
      commentNum: 0,
      videoDetail: {},
      user_id: window.localStorage.userInfo
        ? JSON.parse(window.localStorage.userInfo)._id
        : "",
      isLiked: false,
      isCollected: false,
    };
  },
  methods: {
    async likeVideo() {
      if (!this.videoDetail._id) {
        this.$message({
          message: "该文章不存在！",
          type: "warning",
        });
        return;
      }

      if (this.isLiked) {
        this.$message({
          message: "您已经点过赞了！悠着点吧！",
          type: "warning",
        });
        return;
      }

      if (!this.user_id) {
        this.$message({
          message: "登录才能点赞，请先登录！",
          type: "warning",
        });
        return;
      }
      let params = {
        id: this.videoDetail._id,
        user_id: this.user_id,
      };
      await this.$https.post(this.$urls.likeVideo, params);
      this.isLoading = false;
      this.isLiked = true;
      this.likeNum++;
      ++this.videoDetail.meta.likes;
      this.$message({
        message: "操作成功",
        type: "success",
      });
      this.$https.post(this.$urls.addTimeAxis, {
        user_id: this.user_id,
        title: this.videoDetail.name,
        title_id: this.videoDetail._id,
        type: 7,
      });
    },
    async collectVideo() {
      if (!this.user_id) {
        this.$message({
          message: "登录才能收藏，请先登录！",
          type: "warning",
        });
        return;
      }
      if (this.isCollected) {
        await this.$https.post(this.$urls.delTimeAxis, {
          user_id: this.user_id,
          title: this.videoDetail.name,
          title_id: this.videoDetail._id,
          type: 6,
        });
        this.isCollected = false;
        this.$message({
          message: "取消收藏成功",
          type: "success",
        });
      } else {
        await this.$https.post(this.$urls.addTimeAxis, {
          user_id: this.user_id,
          title: this.videoDetail.name,
          title_id: this.videoDetail._id,
          type: 6,
          content: this.$route.query.src,
          coverSrc: this.$route.query.coverSrc,
        });
        this.isCollected = true;
        this.$message({
          message: "收藏成功",
          type: "success",
        });
      }
    },

    toComment() {
      document.getElementsByClassName("comment")[0].scrollIntoView();
      document.getElementsByClassName("el-textarea__inner")[0].focus();
    },

    async handleAddComment() {
      if (!this.videoDetail._id) {
        this.$message({
          message: "该视频不存在！",
          type: "error",
        });
        return;
      }

      if (this.commentTimes > 2) {
        this.$message({
          message: "您今天评论的次数已经用完，明天再来评论吧！",
          type: "warning",
        });
        return;
      }

      let now = new Date();
      let nowTime = now.getTime();
      if (nowTime - this.cacheTime < 4000) {
        this.$message({
          message: "您评论太过频繁，1 分钟后再来留言吧！",
          type: "warning",
        });
        return;
      }

      if (!this.content) {
        this.$message({
          message: "请输入内容!",
          type: "warning",
        });
        return;
      }
      // let user_id = "";
      // if (window.localStorage.userInfo) {
      //   let userInfo = JSON.parse(window.localStorage.userInfo);
      //   user_id = userInfo._id;
      // } else {
      //   this.$message({
      //     message: "登录才能评论，请先登录！",
      //     type: "warning",
      //   });
      //   return;
      // }
      if (!this.user_id) {
        this.$message({
          message: "登录才能评论，请先登录！",
          type: "warning",
        });
        return;
      }

      this.btnLoading = true;
      await this.$https.post(this.$urls.addComment, {
        article_id: this.videoDetail._id,
        user_id: this.user_id,
        content: this.content,
        isVideo: true,
      });
      this.btnLoading = false;
      this.commentTimes++;
      this.cacheTime = nowTime;
      this.content = "";
      this.$message({
        message: "操作成功",
        type: "success",
      });
      this.handleSearch();
      this.$https.post(this.$urls.addTimeAxis, {
        user_id: this.user_id,
        title: this.videoDetail.name,
        title_id: this.videoDetail._id,
        type: 8,
      });
    },
    refreshArticle() {
      this.handleSearch();
    },

    async handleSearch() {
      this.isLoading = true;
      const data = await this.$https.get(this.$urls.getVideoDetail, {
        params: this.params,
      });
      console.log(data);
      this.isLoading = false;
      this.videoDetail = data;
      this.likeNum = data.meta.likes;
      this.commentNum = data.meta.comments;
      let title = data.name;
      document.title = title;
      document
        .querySelector("#description")
        .setAttribute("content", description);
      if (this.user_id) {
        console.log(this.user_id)
        this.$https.post(this.$urls.addTimeAxis, {
          user_id: this.user_id,
          title: this.videoDetail.name,
          title_id: this.videoDetail._id,
          type: 12,
          content: this.$route.query.src,
          coverSrc: this.$route.query.coverSrc,
        });
      }
    },

    async searchTimeAxis() {
      const data = await this.$https.get(this.$urls.searchTimeAxis, {
        params: {
          user_id: this.user_id,
          title_id: this.videoDetail._id,
        },
      });
      data.forEach((element) => {
        if (element.type === 6) this.isCollected = true;
        if (element.type === 7) this.isLiked = true;
      });
    },
  },
  async created() {
    await this.handleSearch();
    if (this.user_id) {
      this.searchTimeAxis();
    }
  },
};
</script>

<style lang="less" scoped>
.videoDetail {
  width: 100%;
  .player-container {
    margin-bottom: 30px;
  }
}
.anchor {
  display: block;
  position: sticky;
  top: 213px;
  margin-top: 213px;
  border-left: 1px solid #eee;
  .anchor-ul {
    position: relative;
    top: 0;
    max-width: 250px;
    border: none;
    -moz-box-shadow: 0 0px 0px #fff;
    -webkit-box-shadow: 0 0px 0px #fff;
    box-shadow: 0 0px 0px #fff;

    li.active {
      color: #009a61;
    }
  }
  a {
    color: #333;
  }
}
// .heart {
//   height: 60px;
//   text-align: center;
//   margin: 50px;
// }
#aside {
  position: fixed;
  top: calc(50% - 90px);
  left: 290px;
  width: 50px;
  height: 180px;
  // background-color: #000;
  .asideItem {
    width: 50px;
    height: 50px;
    background: #eeeeee;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 16px;
      height: 16px;
    }
  }
  .asideItem:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
}
</style>