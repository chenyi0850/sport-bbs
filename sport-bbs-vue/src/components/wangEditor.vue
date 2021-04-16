<template>
  <div class="home">
    <div ref="demo1"></div>
  </div>
</template>

<script>
// 引入 wangEditor
import wangEditor from "wangeditor";
export default {
  props: {
    text: String
  },
  data() {
    return {
      editor: null,
      editorData: "",
    };
  },
  mounted() {
    const editor = new wangEditor(this.$refs.demo1);
    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.onchange = (newHtml) => {
      this.editorData = newHtml;
    };

    // editor.config.menus = [     //菜单配置
    //    'head',
    //    'list', // 列表
    //    'justify', // 对齐方式
    //    'bold',
    //    'fontSize', // 字号
    //    'italic',
    //    'underline',
    //    'image', // 插入图片
    //    'foreColor', // 文字颜色
    //    'undo', // 撤销
    //    'redo', // 重复
    //   ]
    // 配置 onchange 回调函数
    var that = this
    editor.config.onchange = function (newHtml) {
      that.$emit("change", newHtml, editor.txt.text())
    };
    // 配置不能全屏
    editor.config.showFullScreen = false
    // editor.config.uploadImgShowBase64 = true
    // editor.config.uploadImgServer = '/api/uploadImg'
    // 创建编辑器
    editor.create();
    this.editor = editor;
    editor.txt.html(this.text);
  },
  methods: {
  },
  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy();
    this.editor = null;
  },
};
</script>

<style lang="scss">
.home {
  z-index: 0;
  width: 100%;
  margin: auto;
  position: relative;
  .btn {
    position: absolute;
    right: 0;
    top: 0;
    padding: 5px 10px;
    cursor: pointer;
  }
  h3 {
    margin: 30px 0 15px;
  }
}
</style>