<template>
  <div class="equipment left">
    <div class="products" :class="{ 'products-mobile': isMobileOrPc }">
      <div class="title"><span class="titleText">精品推荐</span></div>
      <div class="equip-list">
        <div class="left-btn" @click="slide('left')"></div>
        <div class="right-btn" @click="slide('right')"></div>
        <div class="equip-container" :style="{ left: left + 'px' }">
          <div class="equip-card" v-for="item in products" :key="item.name">
            <div class="images">
              <a :href="item.href" target="_blank"
                ><img :src="item.img" :alt="item.name"
              /></a>
            </div>
            <div class="h2">
              <a
                :href="item.href"
                target="_blank"
                :alt="item.name"
                :title="item.name"
                >{{ item.name }}</a
              >
            </div>
            <div class="price clearfix">
              <div class="t1 clearfix">
                <div class="num">{{ item.price }}</div>
                <div class="zhe">
                  <div class="z1">{{ item.z1 }}</div>
                  <div class="z2">{{ item.z2 }}</div>
                </div>
              </div>
              <div class="t2">
                <a :href="item.href" target="_blank">去购买</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="share">
      <div class="title"><span class="titleText">装备分享</span></div>
      <div class="tag-row">
        <el-tag @click="sort('new')">最新</el-tag>
        <el-tag type="danger" @click="sort('hot')">热门</el-tag>
        <el-tag type="success" @click="sort('view')">最多查看</el-tag>
        <el-tag type="info" @click="sort('like')">最多点赞</el-tag>
        <el-tag type="warning" @click="sort('comment')">最多评论</el-tag>
        <el-button @click="toWrite" v-if="!isMobileOrPc">我要分享</el-button>
      </div>
      <h3 v-if="params.tag_id" class="left-title">{{ tag_name }} 装备：</h3>
      <ul class="articles-list" id="list">
        <transition-group name="el-fade-in">
          <li
            @click="articleDetail(article._id)"
            v-for="article in articlesList"
            :key="article._id"
            class="item"
          >
            <a :href="href + article._id" target="_blank">
              <img
                class="wrap-img img-blur-done"
                :data-src="article.img_url"
                data-has-lazy-src="false"
                src="../assets/bg.jpg"
                alt="文章封面"
              />
              <div class="content">
                <h4 class="articleTitle">{{ article.title }}</h4>
                <p class="abstract">{{ article.desc }}</p>
                <div class="meta">
                  <span>查看 {{ article.meta.views }}</span>
                  <span>评论 {{ article.meta.comments }}</span>
                  <span>赞 {{ article.meta.likes }}</span>
                  <span v-if="article.create_time" class="time">
                    {{ formatTime(article.create_time) }}
                  </span>
                </div>
              </div>
            </a>
          </li>
        </transition-group>
      </ul>
    </div>
    <LoadingCustom v-if="isLoading"></LoadingCustom>
    <LoadEnd v-if="isLoadEnd"></LoadEnd>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import LoadEnd from "@/components/loadEnd.vue";
import LoadingCustom from "@/components/loading.vue";
import {
  throttle,
  getScrollTop,
  getDocumentHeight,
  getWindowHeight,
  getQueryStringByName,
  timestampToTime,
  isMobileOrPc,
} from "@/utils/utils";
import { Params, ProjectList, ProjectsData } from "@/types/index";

// 获取可视区域的高度
const viewHeight = window.innerHeight || document.documentElement.clientHeight;
// 用新的 throttle 包装 scroll 的回调
const lazyload = throttle(() => {
  // 获取所有的图片标签
  const imgs = document.querySelectorAll("#list .item img");
  // num 用于统计当前显示到了哪一张图片，避免每次都从第一张图片开始检查是否露出
  let num = 0;
  for (let i = num; i < imgs.length; i++) {
    // 用可视区域高度减去元素顶部距离可视区域顶部的高度
    let distance = viewHeight - imgs[i].getBoundingClientRect().top;
    let imgItem: any = imgs[i];
    // 如果可视区域高度大于等于元素顶部距离可视区域顶部的高度，说明元素露出
    if (distance >= 100) {
      // 给元素写入真实的 src，展示图片
      let hasLaySrc = imgItem.getAttribute("data-has-lazy-src");
      if (hasLaySrc === "false") {
        imgItem.src = imgItem.getAttribute("data-src");
        imgItem.setAttribute("data-has-lazy-src", "true");
      }
      // 前 i 张图片已经加载完毕，下次从第 i+1 张开始检查是否露出
      num = i + 1;
    }
  }
}, 1000);

@Component({
  components: {
    LoadEnd,
    LoadingCustom,
  },
})
export default class Equipment extends Vue {
  private reverse: boolean = true;
  private isLoadEnd: boolean = false;
  private isLoading: boolean = false;
  private isMobileOrPc: boolean = isMobileOrPc();
  private tag_name: string = decodeURI(getQueryStringByName("tag_name"));
  private list: ProjectList[] = [];
  private total: number = 0;
  private params = {
    keyword: "",
    likes: "", // 是否是热门文章, "" => 最新，"1" => 热门，"2" => 最多查看，"3" => 最多点赞，"4" => 最多评论
    state: 1, // 文章发布状态 => 0 草稿，1 已发布,'' 代表所有文章
    type: 3,
    tag_id: getQueryStringByName("tag_id"),
    category_id: getQueryStringByName("category_id"),
    pageNum: 1,
    pageSize: 10,
  };

  private products = [];
  private left: number = 0;
  private slide(type: string): void {
    if (!isMobileOrPc) {
      if (type === "right") {
        if (this.left === -2490) this.left = 0;
        else this.left -= 830;
      } else {
        if (this.left === 0) this.left = -2490;
        else this.left += 830;
      }
    } else {
      let width = document.getElementsByClassName("equip-container")[0].offsetWidth / 4
      if (type === "right") {
        if (this.left === -3 * width) this.left = 0;
        else this.left -= width;
      } else {
        if (this.left === 0) this.left = -3 * width;
        else this.left += width;
      }
    }
  }

  private articlesList: any = [];
  private href: string =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001/articleDetail?article_id="
      : "https://biaochenxuying.cn/articleDetail?article_id=";

  sort(type: string): void {
    // alert(1)
    switch (type) {
      case "new": {
        this.isLoadEnd = false;
        this.total = 0;
        this.params.pageNum = 1;
        this.articlesList = [];
        this.params.likes = "";
        this.handleSearch();
        break;
      }
      case "hot": {
        this.isLoadEnd = false;
        this.total = 0;
        this.params.pageNum = 1;
        this.articlesList = [];
        this.params.likes = "1";
        this.handleSearch();
        break;
      }
      case "view": {
        this.isLoadEnd = false;
        this.total = 0;
        this.params.pageNum = 1;
        this.articlesList = [];
        this.params.likes = "2";
        this.handleSearch();
        break;
      }
      case "like": {
        this.isLoadEnd = false;
        this.total = 0;
        this.params.pageNum = 1;
        this.articlesList = [];
        this.params.likes = "3";
        this.handleSearch();
        break;
      }
      case "comment": {
        this.isLoadEnd = false;
        this.total = 0;
        this.params.pageNum = 1;
        this.articlesList = [];
        this.params.likes = "4";
        this.handleSearch();
        break;
      }
    }
  }

  toWrite(): void {
    let user_id = "";
    if (window.localStorage.userInfo) {
      let userInfo = JSON.parse(window.localStorage.userInfo);
      user_id = userInfo._id;
    } else {
      this.$message({
        message: "登录后才能发帖，请先登录！",
        type: "warning",
      });
      return;
    }
    this.$router.push("/write?share=true");
  }

  // lifecycle hook
  mounted(): void {
    this.getProducts();
    this.handleSearch();
    window.onscroll = () => {
      if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 100) {
        // 如果不是已经没有数据了，都可以继续滚动加载
        if (this.isLoadEnd === false && this.isLoading === false) {
          this.handleSearch();
        }
      }
    };
    document.addEventListener("scroll", lazyload);
  }

  @Watch("$route")
  routeChange(val: any, oldVal: any): void {
    this.tag_name = decodeURI(getQueryStringByName("tag_name"));
    this.params.tag_id = getQueryStringByName("tag_id");
    this.params.category_id = getQueryStringByName("category_id");
    this.articlesList = [];
    this.params.pageNum = 1;
    this.handleSearch();
  }

  private async getProducts(): Promise<void> {
    this.isLoading = true;
    const data = await this.$https.get(this.$urls.getProducts);
    this.isLoading = false;
    this.products = data;
  }

  private async handleSearch(): Promise<void> {
    this.isLoading = true;
    const data = await this.$https.get(this.$urls.getArticleList, {
      params: this.params,
    });
    this.isLoading = false;
    this.articlesList = [...this.articlesList, ...data.list];
    this.total = data.count;
    this.params.pageNum++;
    if (data.list.length === 0 || this.total === this.articlesList.length) {
      this.isLoadEnd = true;
    }
  }
}
</script>
<style lang="less" scoped>
.equipment {
  .title {
    border-bottom: 3px #eeeeee solid;
    // margin-bottom: 5px;
    .titleText {
      // color: #fff;
      // background-color: #eeeeee;
      display: inline-block;
      padding: 10px 22px;
      font-size: 20px;
      // cursor: pointer;
    }
  }
  .equip-list {
    width: 830px;
    height: 264px;
    border: 1px #e2e2e2 solid;
    overflow: hidden;
    position: relative;
    .left-btn {
      background: url(../assets/slideLeft.png) no-repeat;
      width: 22px;
      height: 46px;
      position: absolute;
      left: 0px;
      top: 98px;
      cursor: pointer;
      z-index: 10;
    }
    .right-btn {
      background: url(../assets/slideRight.png) no-repeat;
      width: 22px;
      height: 46px;
      position: absolute;
      right: 0px;
      top: 98px;
      cursor: pointer;
      z-index: 10;
    }
    .equip-container {
      width: 3320px;
      position: relative;
      transition: left 1s;
      .equip-card {
        box-sizing: border-box;
        display: inline-block;
        width: 207.5px;
        height: 264px;
        border-right: 1px #f3f3f3 solid;
        position: relative;
        .images {
          text-align: center;
          width: 150px;
          height: 150px;
          overflow: hidden;
          margin: 0 auto;
          margin-top: 10px;
        }
        .h2 {
          margin-top: 5px;
          color: #000000;
          text-align: left;
          height: 46px;
          overflow: hidden;
          padding: 0 10px;
          line-height: 24px;
          a {
            color: #333333;
            &:hover {
              color: #ad0007;
            }
          }
        }
        .price {
          padding: 0 7px;
          margin-top: 10px;
          .t1 {
            float: left;
            .num {
              float: left;
              font-size: 28px;
              color: #ff4338;
              font-weight: bold;
              margin-top: 3px;
              s {
                font-size: 20px;
              }
            }
            .zhe {
              float: left;
              margin-left: 3px;
              .z1 {
                color: #ff4338;
                font-size: 12px;
                text-align: center;
                line-height: 16px;
                padding-left: 8px;
                border: 1px #ff4338 solid;
                padding: 0px 3px;
                border-radius: 5px;
              }
              .z2 {
                color: #999999;
                font-size: 12px;
                text-decoration: line-through;
              }
            }
          }
          .t2 {
            float: right;
            a {
              display: inline-block;
              padding: 6px 12px;
              color: #fff;
              background-color: #ff4338;
            }
          }
        }
      }
    }
  }
  .share {
    margin-top: 20px;
  }
  .tag-row {
    padding: 10px 0;
    .el-tag {
      margin-right: 10px;
    }
    .el-tag:hover {
      cursor: pointer;
    }
    .el-button {
      float: right;
    }
  }
  .articles-list {
    margin: 0;
    padding: 0;
    list-style: none;
    .articleTitle {
      color: #333;
      margin: 7px 0 4px;
      display: inherit;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.5;
    }
    .item > div {
      padding-right: 140px;
    }
    .item .wrap-img {
      position: absolute;
      top: 50%;
      margin-top: -50px;
      right: 0;
      width: 125px;
      height: 100px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        border: 1px solid #f0f0f0;
      }
    }
    li {
      line-height: 20px;
      position: relative;
      // width: 100%;
      padding: 15px 0px;
      padding-right: 150px;
      border-bottom: 1px solid #f0f0f0;
      word-wrap: break-word;
      cursor: pointer;
      &:hover {
        .articleTitle {
          color: #000;
        }
      }
      .abstract {
        min-height: 30px;
        margin: 0 0 8px;
        font-size: 13px;
        line-height: 24px;
        color: #555;
      }
      .meta {
        padding-right: 0 !important;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        a {
          margin-right: 10px;
          color: #b4b4b4;
          &::hover {
            transition: 0.1s ease-in;
            -webkit-transition: 0.1s ease-in;
            -moz-transition: 0.1s ease-in;
            -o-transition: 0.1s ease-in;
            -ms-transition: 0.1s ease-in;
          }
        }
        span {
          margin-right: 10px;
          color: #666;
        }
      }
    }
  }
  .products-mobile {
    .equip-list {
      width: 100%;
      .equip-container {
        width: 400%;
        .equip-card {
          width: 12.5%;
          .price {
            .t1 {
              .num {
                font-size: 20px;
              }
            }
          }
        }
      }
    }
  }
}
</style>

