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
	app.post('/login', user.login);
	
	app.get('/getAvatar', user.getAvatar)
	app.post('/loginAdmin', user.loginAdmin);
	app.post('/register', user.register);
	app.post('/delUser', user.delUser);
	app.post('/getUser', user.getUser);
	app.get('/currentUser', user.currentUser);
	app.get('/getUserList', user.getUserList);
	app.get('/userInfo', user.userInfo)

	
	
	app.post('/changeComment', comment.changeComment);
	app.post('/changeThirdComment', comment.changeThirdComment);
	app.get('/getCommentList', comment.getCommentList);

	
	
	
	app.get('/getArticleList', article.getArticleList);
	app.get('/getArticleListAdmin', article.getArticleListAdmin);
	app.post('/getArticleDetail', article.getArticleDetail);
	

	
	app.get('/getTagList', tag.getTagList);

	
	app.post('/addReplyMessage', message.addReplyMessage);
	app.post('/delMessage', message.delMessage);
	app.post('/getMessageDetail', message.getMessageDetail);
	app.get('/getMessageList', message.getMessageList);

	app.post('/addLink', link.addLink);
	app.post('/updateLink', link.updateLink);
	app.post('/delLink', link.delLink);
	app.get('/getLinkList', link.getLinkList);

	app.post('/addCategory', category.addCategory);
	app.post('/delCategory', category.delCategory);
	app.get('/getCategoryList', category.getCategoryList);

	
	
	
	
	app.post('/getTimeAxisDetail', timeAxis.getTimeAxisDetail);
	

	app.post('/addProject', project.addProject);
	app.post('/updateProject', project.updateProject);
	app.post('/delProject', project.delProject);
	app.get('/getProjectList', project.getProjectList);
	app.post('/getProjectDetail', project.getProjectDetail);

	
	app.get('/getVideo', video.getVideo);
	app.get('/getVideosList', video.getVideosList);
	app.get('/getCoverSrc', video.getCoverSrc);
	app.get('/getVideoDetail', video.getVideoDetail);
	
	
	

	app.get('/getProducts', equipment.getProducts)
};
