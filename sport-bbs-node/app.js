// modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

// import 等语法要用到 babel 支持
require('babel-register');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('blog_node_cookie'));
app.use(
	session({
		secret: 'blog_node_cookie',
		name: 'session_id', //# 在浏览器中生成cookie的名称key，默认是connect.sid
		resave: true,
		saveUninitialized: true,
		cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }, //过期时间
	}),
);

const mongodb = require('./core/mongodb');

// data server
mongodb.connect();

// 允许跨域
app.all('*', function (req, res, next) {
	// console.log(req.headers.origin)
	// console.log(req.environ)
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	// res.header("Access-Control-Allow-Origin", '*');
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("X-Powered-By", ' 3.2.1')
	if (req.method === "OPTIONS") res.send(200);/*让options请求快速返回*/
	else next();
});

//将路由文件引入  登录前
const route = require('./routes/index');

//初始化所有路由
route(app);

const {responseClient} = require("./util/util")
//判断是否登录
app.all('*', function(req, res, next) {
	console.log('请求' + req.session.userInfo)
	if(!req.session.userInfo) {
		responseClient(res, 200, 1, '登录过期，请重新登录', req.session.userInfo);
	} else {
		next()
	}
})

//将登录后的路由文件引入
const route2 = require('./routes/index2')
//初始化
route2(app)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	res.setHeader('Cache-Control', 'public, max-age=31557600')
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
