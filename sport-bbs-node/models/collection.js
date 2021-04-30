/**
 * Collection model module.
 * @file 文章数据模型
 * @module model/collection
 * @author chenyi <https://github.com/biaochenxuying>
 */

const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');

// 收藏模型
const collectionSchema = new mongoose.Schema({
    // 用户 id
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // 创建日期
    create_time: { type: Date, default: Date.now },

    // 评论
    collection: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true }],

});

// 自增 ID 插件配置
collectionSchema.plugin(autoIncrement.plugin, {
    model: 'Collection',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

// 文章模型
module.exports = mongoose.model('Collection', collectionSchema);
