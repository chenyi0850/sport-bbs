import Vue from "vue";
import Component from "vue-class-component";
import Router from "vue-router";
// import Home from "./views/home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/news"
    },
    {
      path: "/news",
      name: "news",
      component: () => import(/* webpackChunkName: "news" */ "./views/news.vue")
    },
    // {
    //   path: "/home2",
    //   name: "home2",
    //   component: () => import(/* webpackChunkName: "home2" */ "./views/home2.vue")
    // },
    {
      path: "/articles",
      name: "articles",
      // route level code-splitting
      // this generates a separate chunk (articles.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "articles" */ "./views/articles.vue")
    },
    {
      path: "/videos",
      name: "videos",
      component: () =>
        import(/* webpackChunkName: "videos" */ "./views/videos.vue")
    },
    {
      path: "/videoDetail",
      name: "videoDetail",
      component: () =>
        import(/* webpackChunkName: "videoDetail" */ "./views/videoDetail.vue")
    },
    {
      path: "/equipment",
      name: "equipment",
      component: () =>
        import(/* webpackChunkName: "equipment" */ "./views/equipment.vue")
    },
    {
      path: "/about",
      name: "about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/about.vue")
    },
    // {
    //   path: "/about",
    //   name: "about",
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "./views/articleDetail.vue")
    // },
    {
      path: "/articleDetail",
      name: "articleDetail",
      component: () =>
        import(/* webpackChunkName: "articleDetail" */ "./views/articleDetail.vue")
    },
    {
      path: "/user",
      name: "user",
      component: () => 
        import(/* webpackChunkName: "articleDetail" */ "./views/user.vue")
    },
    {
      path: "/write",
      name: "write",
      component: () =>
        import(/* webpackChunkName: "articleDetail" */ "./views/write.vue")
    }
    // {
    //   path: "*",
    //   redirect: {
    //     name: "home"
    //   }
    // }
  ]
});
