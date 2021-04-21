/**
 * Multimedia model module.
 * @file 文章数据模型
 * @module model/multimedia
 * @author biaochenxuying <https://github.com/biaochenxuying>
 */

const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');

// 多媒体模型
const multimediaSchema = new mongoose.Schema({
    // 文件名
    name: { type: String, required: true, validate: /\S+/ },

    // 上传用户id
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // 文件类型 => 1: 篮球，2: 足球，3：田径，4：其他
    type: { type: Number, default: 1 },

    // 文件保存路径
    src: { type: String, required: true, validate: /\S+/ },

    // 视频的封面图片
    coverSrc: { type: String, validate: /\S+/ },

    // 创建日期
    create_time: { type: Date, default: Date.now },

    // 评论
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true }],

    // 点赞的用户
    like_users: [
        {
            // 用户id
            id: { type: mongoose.Schema.Types.ObjectId },

            // 名字
            name: { type: String, required: true, default: '' },

            // 用户类型 0：博主 1：其他用户
            type: { type: Number, default: 1 },

            // 个人介绍
            introduce: { type: String, default: '' },

            // 头像
            avatar: { type: String, default: 'user' },

            // 创建日期
            create_time: { type: Date, default: Date.now },
        },
    ],

    // 其他元信息
    meta: {
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
    },
});

// 自增 ID 插件配置
multimediaSchema.plugin(autoIncrement.plugin, {
    model: 'Multimedia',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

// 文章模型
module.exports = mongoose.model('Multimedia', multimediaSchema);
