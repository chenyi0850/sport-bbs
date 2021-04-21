<template>
  <el-form
    label-width="70px"
    :model="article"
    :rules="rules"
    ref="ruleForm"
    :label-position="isMobileOrPc ? 'top' : ''"
  >
    <el-form-item label="购买链接" prop="href" v-if="isShare">
      <el-input v-model="article.href"></el-input>
    </el-form-item>
    <el-form-item label="标题" prop="title">
      <el-input v-model="article.title"></el-input>
    </el-form-item>
    <el-form-item label="标签" prop="tags">
      <div class="tags">
        <el-tag
          v-for="tag in tags"
          :key="tag.name"
          :type="tag.type"
          @click="addTag(tag.name, tag.type, tag._id)"
        >
          {{ tag.name }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputTagValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput"
          >添加标签</el-button
        >
      </div>
      <div class="tag-input">
        <el-tag
          v-for="tag in tagsInput"
          :key="tag.name"
          :type="tag.type"
          closable
          @close="handleTagClose(tag)"
        >
          {{ tag.name }}
        </el-tag>
      </div>
      <el-input v-model="article.tags" class="tags-input"></el-input>
    </el-form-item>

    <el-form-item label="内容" prop="content">
      <!-- <el-input v-model="article.content"></el-input> -->
      <wang-editor ref="1" @change="updateContent" :text="article.content" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('ruleForm')">发布</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import wangEditor from "@/components/wangEditor.vue";
import { isMobileOrPc } from "@/utils/utils";
@Component({
  components: {
    wangEditor,
  },
})
export default class WriteArticle extends Vue {
  @Prop({ default: false }) isShare!: boolean;
  @Prop({ default: "" }) articleDetail: any;

  private isMobileOrPc: boolean = isMobileOrPc();
  // 文章表单
  private article: any = {
    href: "",
    title: "",
    tags: "",
    content: "",
    desc: "",
    img_url: "",
  };
  // 表单校验
  private rules: object = {
    title: [
      { required: true, message: "请输入标题", trigger: "blur" },
      { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
    ],
    tags: [{ required: true, message: "请选择标签", trigger: "blur" }],
    content: [{ required: true, message: "请输入内容", trigger: "blur" }],
  };
  // 标签
  tags: object[] = [];
  // 添加标签input
  inputTagValue: string = "";
  inputVisible: boolean = false;
  async handleInputConfirm(): Promise<void> {
    let inputTagValue = this.inputTagValue;
    if (inputTagValue) {
      const res = await this.$https.post(this.$urls.addTag, {
        name: inputTagValue,
      });
      let { name, type } = res;
      this.tags.push({
        name,
        type,
      });
    }
    this.inputVisible = false;
    this.inputTagValue = "";
  }
  showInput(): void {
    this.inputVisible = true;
    this.$nextTick((_) => {
      this.$refs.saveTagInput.$refs.input.focus();
    });
  }
  // 添加标签的div仿input
  tagsInput: object[] = [];
  // 选中标签
  addTag(name: string, type: string, id: any): void {
    let bool = false;
    this.tagsInput.forEach((val: any) => {
      if (val.name === name) {
        bool = true;
      }
    });
    if (bool) return;
    this.tagsInput.push({
      id,
      name,
      type,
    });
    this.article.tags += `${id},`;
  }
  // 清除选中标签
  handleTagClose(tag: any) {
    this.article.tags = this.article.tags.replace(tag.id + ",", "");
    this.tagsInput.splice(this.tagsInput.indexOf(tag), 1);
  }
  // 富文本内容更新
  updateContent(html: string, text: string) {
    let img = html.match(/<img.*?(?:>|\/>)/);

    if (img) {
      img = img[0].match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i);
      if (img) {
        let img_url = img[0].substr(5);
        this.article.img_url = img_url;
      }
    }
    this.article.content = html;
    if (text.length >= 102) {
      this.article.desc = text.slice(0, 102) + "......";
    } else {
      this.article.desc = text;
    }
  }
  // 发布帖子
  onSubmit(formName: any) {
    this.$refs[formName].validate((valid: any) => {
      if (valid) {
        if (this.articleDetail.title) {
          console.log(this.article);
          this.updateArticle();
        } else {
          this.addArticle();
        }

        alert("submit!");
        if (this.isShare) this.$router.push("./equipment");
        else this.$router.push("./articles");
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }

  async getTagList(): Promise<void> {
    this.tags = (
      await this.$https.get(this.$urls.getTagList, {
        params: { keyword: "", pageNum: 1, pageSize: 100 },
      })
    ).list;
  }

  async addArticle(): Promise<void> {
    let user_id = "";
    if (window.localStorage.userInfo) {
      let userInfo = JSON.parse(window.localStorage.userInfo);
      user_id = userInfo._id;
    } else {
      this.$message({
        message: "登录才能发布，请先登录！",
        type: "warning",
      });
      return;
    }
    const params: object = {
      title: this.article.title,
      author: "admin",
      keyword: "",
      desc: this.article.desc,
      content: this.article.content,
      tags: this.article.tags.slice(0, this.article.tags.length - 1),
      type: this.isShare ? 3 : 2,
      buy_link: this.isShare ? this.article.href : "",
      img_url: this.article.img_url,
    };
    const data = await this.$https.post(this.$urls.addArticle, params);

    await this.$https.post(this.$urls.addTimeAxis, {
      user_id,
      title: this.article.title,
      title_id: data._id,
      type: 1,
      content: this.article.desc,
    });
  }

  async updateArticle(): Promise<void> {
    let user_id = "";
    if (window.localStorage.userInfo) {
      let userInfo = JSON.parse(window.localStorage.userInfo);
      user_id = userInfo._id;
    } else {
      this.$message({
        message: "登录才能发布，请先登录！",
        type: "warning",
      });
      return;
    }
    const params: object = {
      id: this.articleDetail._id,
      title: this.article.title,
      author: this.articleDetail.author,
      keyword: "",
      desc: this.article.desc,
      content: this.article.content,
      tags: this.article.tags.slice(0, this.article.tags.length - 1),
      type: this.articleDetail.type,
      buy_link: this.isShare ? this.article.href : "",
      state: this.articleDetail.state,
      img_url: this.articleDetail.img_url,
    };
    const data = await this.$https.post(this.$urls.updateArticle, params);
    console.log(data);
    await this.$https.post(this.$urls.updateTimeAxis, {
      user_id,
      title: this.article.title,
      title_id: this.articleDetail._id,
      type: 1,
      content: this.article.desc,
    });
    // await this.$https.post(this.$urls.addTimeAxis, {
    //   user_id,
    //   title: this.article.title,
    //   title_id: data._id,
    //   type: 13,
    //   content: this.article.desc,
    // });
  }

  created(): void {
    this.getTagList();
    if (this.articleDetail.title) {
      const { buy_link, title, tags, content, desc } = this.articleDetail;
      this.article = {
        href: buy_link,
        title,
        content,
        desc,
      };
      this.article.tags = "";
      tags.forEach((element: any) => {
        this.tagsInput.push({
          name: element.name,
          type: element.type,
        });
        // console.log(element._id)
        this.article.tags += `${element._id},`;
      });
    }
  }
}
</script>

<style lang="less" scoped>
.el-input {
  width: 100%;
}
.tags {
  padding-bottom: 22px;
}
.tag-input {
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: 40px;
  width: 100%;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.tags-input {
  display: none;
}
.el-tag {
  margin-right: 10px;
}
.el-tag:hover {
  cursor: pointer;
}
</style>