<template>
  <div class="archive left">
    <el-timeline>
      <!-- <el-timeline-item v-for="(l, i) in timeAxisList"
                        :key="l.year"
                        placement="top"
                        hide-timestamp>
        <h3 class="year">{{l.year}}</h3> -->

      <el-timeline-item
        v-for="item in timeAxisList"
        :key="item._id"
        placement="top"
        hide-timestamp
      >
        <router-link
          :to="item.type === 5 || 6 || 7 || 8 ? `videoDetail?src=${item.content}&coverSrc=${item.coverSrc}` : `/articleDetail?article_id=${item.title_id}`"
          target="_blank"
        >
          <h3 class="item">{{ item.action }}  <span class="title">{{ item.title }}</span></h3>
        </router-link>
        <p>{{ formatTime(item.update_time) }}</p>
      </el-timeline-item>
      <!-- </el-timeline-item> -->
    </el-timeline>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getDocumentHeight, getScrollTop, getWindowHeight, timestampToTime } from "@/utils/utils";
import { ParamsArchive, ArchiveData } from "@/types/index";

@Component({
  components: {},
})
export default class Archive extends Vue {
  private isLoadEnd: boolean = false;
  private isLoading: boolean = false;
  private timeAxisList: Array<object> = [];
  private total: number = 0;
  private user_id: string = window.localStorage.userInfo
    ? JSON.parse(window.localStorage.userInfo)._id
    : "";
  private params = {
    user_id: this.user_id,
    pageNum: 1,
    pageSize: 10,
  };

  mounted(): void {
    this.handleSearch();
    window.onscroll = () => {
      if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 150) {
        // 如果不是已经没有数据了，都可以继续滚动加载
        if (this.isLoadEnd === false && this.isLoading === false) {
          this.handleSearch();
        }
      }
    };
  }

  private async handleSearch(): Promise<void> {
    this.isLoading = true;
    const data = await this.$https.get(this.$urls.getTimeAxisList, {
      params: this.params,
    });
    data.list.forEach((element: any) => {
      switch (element.type) {
        case 1: {
          element.action = "发表了帖子";
          break;
        }
        case 2: {
          element.action = "收藏了帖子";
          break
        }
        case 3: {
          element.action = "点赞了帖子";
          break
        }
        case 4: {
          element.action = "评论了帖子";
          break
        }
        case 5: {
          element.action = "上传了视频";
          break
        }
        case 6: {
          element.action = "收藏了视频";
          break
        }
        case 7: {
          element.action = "点赞了视频";
          break
        }
        case 8: {
          element.action = "评论了视频";
          break
        }
        case 9: {
          element.action = "收藏了新闻";
          break
        }
        case 10: {
          element.action = "点赞了新闻";
          break
        }
        case 11: {
          element.action = "评论了新闻";
          break
        }
        case 13: {
          element.action = "更新了帖子"
        }
      }
    });
    this.isLoading = false;
    this.timeAxisList = [...this.timeAxisList, ...data.list];
    this.total = data.count;
    this.params.pageNum++;
    if (data.list.length === 0 || this.total === this.timeAxisList.length) {
      this.isLoadEnd = true;
    }
  }
}
</script>
<style lang="less" scoped>
.archive {
  // padding: 40px 0;
  .year {
    font-size: 30px;
    font-weight: bold;
    color: #000;
    margin-top: 0;
  }
  a {
    text-decoration: none;
  }

  .item {
    color: #409eff;
    cursor: auto;
    .title {
      color: #333;
    }
    .title:hover {
      color: #1890ff;
      cursor: pointer;
    }
  }
}
</style>

