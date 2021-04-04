<template>
  <div class="videos left">
    <div
      class="video-card"
      :class="{'video-card-mobile' : isMobileOrPc}"
      v-for="item in videosList"
      :key="item.id"
      @click="toVideoDetail(item.src, item.coverSrc)"
    >
      <img :src="item.coverSrc" />
      <p>{{ item.name }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { isMobileOrPc } from "@/utils/utils";
import { timestampToTime } from "@/utils/utils";
import { ParamsArchive, ArchiveData } from "@/types/index";

@Component({
  components: {},
})
export default class Videos extends Vue {
  isMobileOrPc:boolean = isMobileOrPc()
  private isLoadEnd: boolean = false;
  private isLoading: boolean = false;
  private videosList: Array<object> = [];
  private total: number = 0;
  private params = {
    pageNum: 1,
    pageSize: 10,
  };

  toVideoDetail(src: string, coverSrc: string): void {
    let { href } = this.$router.resolve({ path: `videoDetail?src=${src}&coverSrc=${coverSrc}` });
    window.open(href, "_blank");
  }

  mounted(): void {
    this.handleSearch();
  }

  private async handleSearch(): Promise<void> {
    this.isLoading = true;
    const data = await this.$https.get(this.$urls.getVideosList, {
      params: this.params,
    });
    this.isLoading = false;
    this.videosList = [...this.videosList, ...data.list];
    this.total = data.count;
    this.params.pageNum++;
    if (this.total === this.videosList.length) {
      this.isLoadEnd = true;
    }
  }
}
</script>
<style lang="less" scoped>
.videos {
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

