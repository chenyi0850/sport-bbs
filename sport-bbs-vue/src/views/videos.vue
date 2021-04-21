<template>
  <div class="videos left">
    <div v-if="!isShowMore">
      <div class="basketball">
        <div class="title" style="margin-top: 5px">
          <span class="titleText">篮球</span
          ><el-button
            :style='isMobileOrPc ? "float: right; margin-right: 10px" : "float: right; margin-right: 40px"'
            @click="showMore('1')"
            >查看更多</el-button
          >
        </div>
        <div
          class="video-card"
          :class="{ 'video-card-mobile': isMobileOrPc }"
          v-for="item in basketVideosList"
          :key="item.id"
          @click="toVideoDetail(item.src, item.coverSrc)"
        >
          <img :src="item.coverSrc" />
          <p>{{ item.name }}</p>
        </div>
      </div>
      <div class="football">
        <div class="title">
          <span class="titleText">足球</span
          ><el-button
            :style='isMobileOrPc ? "float: right; margin-right: 10px" : "float: right; margin-right: 40px"'
            @click="showMore('2')"
            >查看更多</el-button
          >
        </div>
        <div
          class="video-card"
          :class="{ 'video-card-mobile': isMobileOrPc }"
          v-for="item in footVideosList"
          :key="item.id"
          @click="toVideoDetail(item.src, item.coverSrc)"
        >
          <img :src="item.coverSrc" />
          <p>{{ item.name }}</p>
        </div>
      </div>
      <div class="athletics">
        <div class="title">
          <span class="titleText">田径</span
          ><el-button
            :style='isMobileOrPc ? "float: right; margin-right: 10px" : "float: right; margin-right: 40px"'
            @click="showMore('3')"
            >查看更多</el-button
          >
        </div>
        <div
          class="video-card"
          :class="{ 'video-card-mobile': isMobileOrPc }"
          v-for="item in athleticsVideosList"
          :key="item.id"
          @click="toVideoDetail(item.src, item.coverSrc)"
        >
          <img :src="item.coverSrc" />
          <p>{{ item.name }}</p>
        </div>
      </div>
      <div class="others">
        <div class="title">
          <span class="titleText">其他</span
          ><el-button
            :style='isMobileOrPc ? "float: right; margin-right: 10px" : "float: right; margin-right: 40px"'
            @click="showMore('4')"
            >查看更多</el-button
          >
        </div>
        <div
          class="video-card"
          :class="{ 'video-card-mobile': isMobileOrPc }"
          v-for="item in othersVideoList"
          :key="item.id"
          @click="toVideoDetail(item.src, item.coverSrc)"
        >
          <img :src="item.coverSrc" />
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="el-page-header">
        <div class="el-page-header__left" @click="goBack">
          <i class="el-icon-back"></i>
          <div class="el-page-header__title">返回</div>
        </div>
        <div class="el-page-header__content">详情页面</div>
      </div>
      <div
        class="video-card"
        :class="{ 'video-card-mobile': isMobileOrPc }"
        v-for="item in videosList"
        :key="item.id"
        @click="toVideoDetail(item.src, item.coverSrc)"
      >
        <img :src="item.coverSrc" />
        <p>{{ item.name }}</p>
      </div>
    </div>
    <LoadingCustom v-if="isLoading"></LoadingCustom>
    <LoadEnd v-if="isLoadEnd"></LoadEnd>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { isMobileOrPc } from "@/utils/utils";
import LoadEnd from "@/components/loadEnd.vue";
import LoadingCustom from "@/components/loading.vue";
import { timestampToTime } from "@/utils/utils";
import { ParamsArchive, ArchiveData } from "@/types/index";

@Component({
  components: {
    LoadEnd,
    LoadingCustom
  },
})
export default class Videos extends Vue {
  isMobileOrPc: boolean = isMobileOrPc();
  private isLoadEnd: boolean = false;
  private isLoading: boolean = false;
  private basketVideosList: Array<object> = [];
  private footVideosList: Array<object> = [];
  private athleticsVideosList: Array<object> = [];
  private othersVideoList: Array<object> = [];
  private videosList: Array<object> = [];
  private isShowMore: boolean = false;
  private total: number = 0;
  private params = {
    pageNum: 1,
    pageSize: 25,
    type: 1,
  };

  async showMore(type: string): Promise<void> {
    this.isShowMore = true;
    this.isLoading = true;
    const data = await this.$https.get(this.$urls.getVideosList, {
      params: this.params,
    });
    this.videosList = [...this.videosList, ...data.list];
    this.isLoading = false;
    this.total = data.count;
    this.params.pageNum++;
    if (this.total === this.videosList.length) {
      this.isLoadEnd = true;
    }
  }

  goBack():void {
    this.isShowMore = false
  }

  toVideoDetail(src: string, coverSrc: string): void {
    let { href } = this.$router.resolve({
      path: `videoDetail?src=${src}&coverSrc=${coverSrc}`,
    });
    window.open(href, "_blank");
  }

  mounted(): void {
    this.handleSearch();
  }

  private async handleSearch(): Promise<void> {
    this.isLoading = true;
    const data = await this.$https.get(this.$urls.getVideosList, {
      params: {
        pageNum: 1,
        pageSize: 5,
        type: 1,
      },
    });
    this.basketVideosList = [...this.basketVideosList, ...data.list];
    const data2 = await this.$https.get(this.$urls.getVideosList, {
      params: {
        pageNum: 1,
        pageSize: 5,
        type: 2,
      },
    });
    this.footVideosList = [...this.footVideosList, ...data2.list];
    const data3 = await this.$https.get(this.$urls.getVideosList, {
      params: {
        pageNum: 1,
        pageSize: 5,
        type: 3,
      },
    });
    this.athleticsVideosList = [...this.athleticsVideosList, ...data3.list];
    const data4 = await this.$https.get(this.$urls.getVideosList, {
      params: {
        pageNum: 1,
        pageSize: 5,
        type: 4,
      },
    });
    this.othersVideoList = [...this.othersVideoList, ...data4.list];
    this.isLoading = false;
    // this.total = data.count;
    // this.params.pageNum++;
    // if (this.total === this.basketVideosList.length) {
    //   this.isLoadEnd = true;
    // }
  }
}
</script>
<style lang="less" scoped>
.videos {
  .title {
    border-bottom: 3px #eeeeee solid;
    margin-top: 20px;
    .titleText {
      display: inline-block;
      padding: 10px 22px;
      font-size: 20px;
    }
  }
  .el-page-header {
    margin-top: 10px;
    display: flex;
    line-height: 24px;
    .el-page-header__left {
      display: flex;
      cursor: pointer;
      margin-right: 40px;
      position: relative;
      .el-icon-back {
        font-size: 18px;
        margin-right: 6px;
        align-self: center;
      }
      &::after {
        content: "";
        position: absolute;
        width: 1px;
        height: 16px;
        right: -20px;
        top: 50%;
        transform: translateY(-50%);
        background-color: #dcdfe6;
      }
    }
    .el-page-header__content {
      font-size: 18px;
      color: #303133;
    }
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
}
</style>

