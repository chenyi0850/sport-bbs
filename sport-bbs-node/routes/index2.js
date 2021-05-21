/*
*所有的路由接口
*/
const user = require('./user');
const article = require('./article');
const comment = require('./comment');
const message = require('./message');
const tag = require('./tag');
const link = require('./link');
const category = require('./category');
const timeAxis = require('./timeAxis');
const project = require('./project');
const video = require('./video');
const equipment = require('./equipment')

module.exports = app => {
    //根据前端判断登录后才能使用的接口
	app.post('/addArticle', article.addArticle);
    app.post('/addThirdComment', comment.addThirdComment);
    app.post('/updateArticle', article.updateArticle);
    app.post('/addComment', comment.addComment);
    app.post('/likeArticle', article.likeArticle);
    app.post('/delTimeAxis', timeAxis.delTimeAxis);
    app.post("/likeVideo", video.likeVideo);
    app.post('/addTimeAxis', timeAxis.addTimeAxis);

    //根据逻辑判断登录后才能使用的接口
    app.post('/logout', user.logout);
    app.post('/delArticle', article.delArticle);
    app.post('/addTag', tag.addTag);
	app.post('/delTag', tag.delTag);
    
    app.post('/updateTimeAxis', timeAxis.updateTimeAxis);
    app.get('/getTimeAxisList', timeAxis.getTimeAxisList);
    app.get('/searchTimeAxis', timeAxis.searchTimeAxis)
    app.post('/uploadVideo', video.uploadVideo);
    app.post('/delVideo', video.delVideo)
    app.post('/updateUser', user.updateUser)
    app.post('/uploadAvatar', user.uploadAvatar)
};
