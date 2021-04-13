<template>
  <div class="right slider">
    <img class="right-logo"
         src="../assets/userLogo.png"
         alt="">
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
      <el-input placeholder="请输入关键字" v-model="keyword" class="input-search">
    <!-- <el-select v-model="select" slot="prepend" placeholder="请选择">
      <el-option label="餐厅名" value="1"></el-option>
      <el-option label="订单号" value="2"></el-option>
      <el-option label="用户电话" value="3"></el-option>
    </el-select> -->
    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
     </el-input>
    </div>
    <div class="tags">
      <div class="title">标签</div>
      <router-link v-for="item in list"
                   class="item"
                   :key="item._id"
                   :to="`${tagType}?tag_id=${item._id}&tag_name=${item.name}&category_id=`">
        <span :key="item._id">{{item.name}}</span>
      </router-link>
    </div>
    <div class="introduce">
      <div class="title">热门帖子</div>
      <div class="content">
        <!-- <img style="width:100%;"
             src="../assets/BiaoChenXuYing.png"
             alt="热门帖子" /> -->
      </div>
    </div>
    <div class="introduce">
      <div class="title">手机扫码访问</div>
      <div class="content">
        <!-- <img style="width:100%;"
             src="../assets/YingHeZaHuoPu.png"
             alt="二维码" /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Params, TagsData } from "@/types/index";

@Component
export default class Slider extends Vue {
  private isLoadEnd: boolean = false;
  private isLoading: boolean = false;
  private list: Array<object> = [];
  private total: number = 0;
  private params: Params = {
    keyword: "",
    pageNum: 1,
    pageSize: 100
  };
  private keyword: string =  ""
  @Prop({default: ""}) tagType!: string
  mounted(): void {
    this.handleSearch();
  }

  private search() {
    if(!this.keyword) {
      this.$message({
        type: "warning",
        message: "请输入关键字"
      })
      return
    }
    window.open("/searchResult?keyword=" + this.keyword, "_blank")
  }

  private async handleSearch(): Promise<void> {
    this.isLoading = true;
    const data: TagsData = await this.$https.get(this.$urls.getTagList, {
      params: this.params
    });
    this.isLoading = false;

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
      padding: 20px 0;
    }
    .footer {
      padding-bottom: 10px;
    }
  }
  .tags {
    min-height: 200px;
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
