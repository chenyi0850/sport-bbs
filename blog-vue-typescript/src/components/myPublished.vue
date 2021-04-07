<template>
  <div>
    <div v-for="item in publishedList" :key="item._id" class="item">
      <div
        class="video-card"
        :class="{ 'video-card-mobile': isMobileOrPc }"
        @click="toVideoDetail(item.content, item.coverSrc)"
        v-if="item.coverSrc"
      >
        <img :src="item.coverSrc" />
        <p>{{ item.title }}</p>
      </div>
      <a :href="href + item.title_id" target="_blank" v-else>
        <!-- <img
          class="wrap-img img-blur-done"
          :data-src="item.img_url"
          data-has-lazy-src="false"
          src="../assets/bg.jpg"
          alt="文章封面"
        /> -->
        <div class="content">
          <h4 class="title">{{ item.title }}</h4>
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
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { isMobileOrPc } from "@/utils/utils";
@Component({})
export default class myPublished extends Vue {
  @Prop({ default: "1, 5" }) type: string;
  private isLoadEnd: boolean = false;
  private isLoading: boolean = false;
  private isMobileOrPc: boolean = isMobileOrPc();
  private publishedList: Array<object> = [];
  private total: number = 0;
  private user_id: string = window.sessionStorage.userInfo
    ? JSON.parse(window.sessionStorage.userInfo)._id
    : "";
  private href: string =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001/articleDetail?article_id="
      : "https://biaochenxuying.cn/articleDetail?article_id=";
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
    console.log(this.publishedList);
    this.total = data.count;
    this.params.pageNum++;
    if (this.total === this.publishedList.length) {
      this.isLoadEnd = true;
    }
  }
  mounted(): void {
    this.handleSearchPublish();
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
.title {
  color: #333;
  margin: 7px 0 4px;
  display: inherit;
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
  .time {
    color: #666;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
  }
}
</style>