/**
 * TimeAxis model module.
 * @file 时间轴模型
 * @module model/timeAxis
 * @author biaochenxuying <https://github.com/biaochenxuying>
 */

const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');

// 时间轴模型
const timeAxisSchema = new mongoose.Schema({
	// 用户id
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

	// 标题
	title: { type: String, required: true },

	// 时间轴内容(帖子的描述，视频的src)
	content: { type: String },

	// 视频封面src, 帖子或新闻img_src
	coverSrc: { type: String },

	// 时间轴内容的id
	title_id: { type: mongoose.Schema.Types.ObjectId },

	// 类型 1 是发表帖子 ，2 是收藏帖子，3 是点赞帖子，4是评论帖子，5是上传视频， 6是收藏视频，7是点赞视频，8是评论视频，9是收藏新闻，10是点赞新闻，11是评论新闻, 12是浏览, 13是更新
	type: { type: Number, default: 1 },

	// 状态 1 是已经完成 ，2 是正在进行，3 是没完成
	// state: { type: Number, default: 1 },

	// 开始日期
	// start_time: { type: Date, default: Date.now },

	// 结束日期
	// end_time: { type: Date, default: Date.now },

	// 最后修改日期
	update_time: { type: Date, default: Date.now },
});

// 自增ID插件配置
timeAxisSchema.plugin(autoIncrement.plugin, {
	model: 'TimeAxis',
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

// 时间轴模型
module.exports = mongoose.model('TimeAxis', timeAxisSchema);
