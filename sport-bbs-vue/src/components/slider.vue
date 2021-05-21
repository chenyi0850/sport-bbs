<template>
  <div class="right slider">
    <img class="right-logo" src="../assets/userLogo.png" alt="" />
    <div class="title">Sport BBS</div>
    <div class="right-content">
      <!-- <div class="item">
        <div class="num">123</div>粉丝
      </div>
      <div class="item">
        <div class="num">123</div>文章
      </div>
      <div class="item">
        <div class="num">123</div>字数
      </div>
      <div class="item">
        <div class="num">123</div>收获喜欢
      </div> -->
      <el-input
        placeholder="请输入关键字"
        v-model="keyword"
        class="input-search"
        style="width: 300px"
        @keyup.enter.native="search"
      >
        <!-- <el-select v-model="select" slot="prepend" placeholder="请选择">
      <el-option label="餐厅名" value="1"></el-option>
      <el-option label="订单号" value="2"></el-option>
      <el-option label="用户电话" value="3"></el-option>
    </el-select> -->
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="search"
        ></el-button>
      </el-input>
    </div>
    <div class="tags">
      <div class="title">标签</div>
      <router-link
        v-for="item in list"
        class="item"
        :key="item._id"
        :to="`${tagType}?tag_id=${item._id}&tag_name=${item.name}`"
      >
        <span :key="item._id">{{ item.name }}</span>
      </router-link>
    </div>
    <div class="introduce">
      <div class="title">热门帖子</div>
      <div class="content">
        <div v-for="item in articleList" :key="item._id">
          <a :href="href + item._id" class="hot-link" target="_blank">{{
            item.title
          }}</a>
        </div>
      </div>
    </div>
    <div class="introduce">
      <div class="title">手机扫码访问</div>
      <div class="content">
        <img
          style="width: 200px; height: 200px; margin: 0 auto; display: block"
          src="../assets/chitu_500.png"
          alt="二维码"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ArticlesData, Params, TagsData } from "@/types/index";
import { getQueryStringByName } from "@/utils/utils";

@Component
export default class Slider extends Vue {
  private isLoadEnd: boolean = false;
  private isLoading: boolean = false;
  private list: Array<object> = [];
  private total: number = 0;
  private params: Params = {
    keyword: "",
    pageNum: 1,
    pageSize: 100,
  };
  private keyword: string = "";
  private articleList: Array<object> = [];
  private href: string =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001/articleDetail?article_id="
      : "http://119.29.3.138/articleDetail?article_id=";
  @Prop({ default: "" }) tagType!: string;
  mounted(): void {
    this.handleSearch();
  }

  private search() {
    if (!this.keyword) {
      this.$message({
        type: "warning",
        message: "请输入关键字",
      });
      return;
    }
    window.open("/searchResult?keyword=" + this.keyword, "_blank");
  }

  private async handleSearch(): Promise<void> {
    const data: TagsData = await this.$https.get(this.$urls.getTagList, {
      params: this.params,
    });
    const data2: ArticlesData = await this.$https.get(
      this.$urls.getArticleList,
      {
        params: {
          keyword: "",
          likes: "1", // 是否是热门文章, "" => 最新，"1" => 热门，"2" => 最多查看，"3" => 最多点赞，"4" => 最多评论
          state: 1, // 文章发布状态 => 0 草稿，1 已发布,'' 代表所有文章
          type: 2,
          // tag_id: getQueryStringByName("tag_id"),
          // category_id: getQueryStringByName("category_id"),
          pageNum: 1,
          pageSize: 10,
        },
      }
    );

    this.articleList = data2.list;
    this.list = [...this.list, ...data.list];
    this.total = data.count;
    this.params.pageNum++;
    if (this.total === this.list.length) {
      this.isLoadEnd = true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.slider {
  padding-top: 50px;
}
.right {
  text-align: center;
  .right-logo {
    width: 130px;
    border-radius: 50%;
    animation: mylogo 3s;
    -moz-animation: mylogo 3s; /* Firefox */
    -webkit-animation: mylogo 3s; /* Safari and Chrome */
    -o-animation: mylogo 3s; /* Opera */
    animation-iteration-count: infinite;
  }
  .title {
    font-size: 25px;
    font-weight: bold;
  }
  .right-content {
    padding: 10px 0 20px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    .item {
      display: inline-block;
      padding: 0 10px;
      color: #969696;
      border-right: 1px solid #eee;
      &:last-child {
        border-right: none;
      }
      .num {
        color: #333;
      }
    }
  }
  .introduce {
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    .title {
      font-size: 14px;
      color: #969696;
    }
    .content {
      color: #333;
      line-height: 26px;
      text-align: left;
      padding: 20px;
      .hot-link {
        color: #909399;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        &:hover {
          color: #6b6b6e;
          text-decoration-line: underline;
        }
      }
    }
    .footer {
      padding-bottom: 10px;
    }
  }
  .tags {
    // min-height: 200px;
    padding: 5px 0 20px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    .title {
      font-size: 14px;
      color: #969696;
    }
    .item {
      display: inline-block;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 5px;
      background-color: #eee;
      color: #333;
      margin: 10px 10px 0 0;
      text-decoration: none;
      &:hover {
        color: #409eff;
      }
    }
  }
  .classification {
    padding: 5px 0 20px 0;
    .title {
      font-size: 14px;
      color: #969696;
    }
    .item {
      text-align: center;
      padding: 10px;
      border-bottom: 1px solid #eee;
      color: #666;
      margin: 10px 10px 0 0;
    }
  }
}
@keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-moz-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-webkit-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-o-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}
</style>
