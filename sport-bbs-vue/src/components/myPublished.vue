<template>
  <div>
    <div v-for="item in publishedList" :key="item._id" class="item">
      <div v-if="item.coverSrc" class="video-row">
        <div
          class="video-card"
          :class="{ 'video-card-mobile': isMobileOrPc }"
          @click="toVideoDetail(item.content, item.coverSrc)"
        >
          <img :src="item.coverSrc" />
          <p>{{ item.title }}</p>
        </div>
        <div class="video-btn">
          <el-button
            icon="el-icon-delete"
            circle
            @click="edit('delVideo', type, item)"
          ></el-button>
        </div>
      </div>
      <div
        v-else
        @click="toArticleDetail(href + item.title_id)"
        class="article-row"
      >
        <!-- <img
          class="wrap-img img-blur-done"
          :data-src="item.img_url"
          data-has-lazy-src="false"
          src="../assets/bg.jpg"
          alt="文章封面"
        /> -->
        <div class="content">
          <h4 class="title">
            {{ item.title }}
            <div>
              <el-button
                v-if="type === '1,5,13'"
                icon="el-icon-edit"
                circle
                @click.stop="edit('editArticle', type, item)"
              ></el-button>
              <el-button
                icon="el-icon-delete"
                circle
                @click.stop="edit('delArticle', type, item)"
              ></el-button>
            </div>
          </h4>
          <p class="abstract">{{ item.content }}</p>
          <div class="meta">
            <!-- <span>查看 {{ item.meta.views }}</span>
            <span>评论 {{ item.meta.comments }}</span>
            <span>赞 {{ item.meta.likes }}</span> -->
            <span v-if="item.update_time" class="time">
              {{ formatTime(item.update_time) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  getDocumentHeight,
  getScrollTop,
  getWindowHeight,
  isMobileOrPc,
} from "@/utils/utils";
@Component({})
export default class myPublished extends Vue {
  @Prop({ default: "1, 5" }) type: string;
  private isLoadEnd: boolean = false;
  private isLoading: boolean = false;
  private isMobileOrPc: boolean = isMobileOrPc();
  private publishedList: Array<object> = [];
  private total: number = 0;
  private user_id: string = window.localStorage.userInfo
    ? JSON.parse(window.localStorage.userInfo)._id
    : "";
  private href: string =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001/articleDetail?article_id="
      : "http:119.29.3.138/articleDetail?article_id=";
  private params = {
    user_id: this.user_id,
    pageNum: 1,
    pageSize: 10,
    types: "",
  };
  toVideoDetail(src: string, coverSrc: string): void {
    let { href } = this.$router.resolve({
      path: `videoDetail?src=${src}&coverSrc=${coverSrc}`,
    });
    window.open(href, "_blank");
  }
  private async handleSearchPublish(): Promise<void> {
    this.isLoading = true;
    this.params.types = this.type;
    const data = await this.$https.get(this.$urls.getTimeAxisList, {
      params: this.params,
    });
    // data.list.forEach((element: any) => {
    //   if (element.coverSrc)
    //     element.coverSrc = "http://localhost:3000/" + element.coverSrc;
    // });
    this.isLoading = false;
    this.publishedList = [...this.publishedList, ...data.list];
    this.total = data.count;
    this.params.pageNum++;
    if (data.list.length === 0 || this.total === this.publishedList.length) {
      this.isLoadEnd = true;
    }
  }
  toArticleDetail(href: string) {
    window.open(href, "_blank");
  }
  private async edit(kind: string, type: string, item: any): Promise<void> {
    console.log(kind, type, item);
    let _id = item._id;
    let title_id = item.title_id;
    if (kind === "editArticle") {
      this.$router.push("/write?article_id=" + title_id);
    } else {
      if (type === "1,5,13") {
        try {
          var value = await this.$confirm("确认删除吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          });
        } catch (error) {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
          return
        }
        if (kind === "delArticle") {
          const data = await this.$https.post(this.$urls.delArticle, {
            id: item.title_id,
          });
          console.log(data);
        } else {
          const data = await this.$https.post(this.$urls.delVideo, {
            id: item.title_id,
          });
          console.log(data);
        }
      }
      const data = await this.$https.post(this.$urls.delTimeAxis, {
        _id,
      });
      let index = 0;
      this.publishedList.forEach((val: any, idx) => {
        if (val._id === _id) {
          index = idx;
        }
      });
      this.publishedList.splice(index, 1);
      if (data !== "删除成功") {
        this.$message.error("删除失败");
        return;
      }
      if (type === "1,5,13") {
        this.$message({
          message: "删除成功",
          type: "success",
        });
      } else if (type === "2,6,9") {
        this.$message({
          message: "取消收藏成功",
          type: "success",
        });
      } else {
        this.$message({
          message: "删除浏览记录成功",
          type: "success",
        });
      }
    }
  }
  mounted(): void {
    this.handleSearchPublish();
    window.onscroll = () => {
      if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 150) {
        // 如果不是已经没有数据了，都可以继续滚动加载
        if (this.isLoadEnd === false && this.isLoading === false) {
          this.handleSearchPublish();
        }
      }
    };
  }
}
</script>

<style lang="less" scoped>
.item {
  border-bottom: 1px #f0f0f0 solid;
  padding-left: 20px;
  margin-bottom: 10px;
}
.video-card {
  margin: 15px 20px 5px 5px;
  display: inline-block;
  padding-right: 10px;
  width: 200px;
  &:hover {
    cursor: pointer;
    background: rgb(248, 246, 246);
    p {
      color: #409eff;
    }
  }
  img {
    width: 200px;
    height: 120px;
  }
  p {
    margin-top: 8px;
    margin-bottom: 0px;
    font-size: 14px;
    width: 200px;
    height: 36px;
    overflow: hidden;
  }
}
.video-btn {
  float: right;
}
.video-card-mobile {
  box-sizing: border-box;
  width: 100%;
  img {
    width: 100%;
  }
  p {
    width: 100%;
  }
}
.article-row {
  cursor: pointer;
}
.title {
  color: #333;
  margin: 7px 0 4px;
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
}
.abstract {
  min-height: 30px;
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 24px;
  color: #555;
}
.meta {
  //   display: flex;
  //   justify-content: space-between;
  //   height: 50px;
  .time {
    color: #666;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
  }
}
</style>