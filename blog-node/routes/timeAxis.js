import { responseClient } from '../util/util';
import TimeAxis from '../models/timeAxis';

//获取全部时间轴内容
exports.getTimeAxisList = (req, res) => {
  let user_id = req.query.user_id;
  let pageNum = parseInt(req.query.pageNum) || 1;
  let pageSize = parseInt(req.query.pageSize) || 10;
  let conditions = {
    user_id,
    type: {$ne: 12}
  };
  if (req.query.types) {
    let types = req.query.types.split(",")
    console.log(types)
    let $or = []
    types.forEach(val => {
      let condition = {
        user_id,
        type: parseInt(val)
      }
      $or.push(condition)
    })
    conditions = { $or }
  }
  let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
  let responseData = {
    count: 0,
    list: [],
  };
  TimeAxis.countDocuments({}, (err, count) => {
    if (err) {
      console.error('Error:' + err);
    } else {
      responseData.count = count;
      let fields = {
        title: 1,
        title_id: 1,
        content: 1,
        update_time: 1,
        type: 1,
        coverSrc: 1
      }; // 待返回的字段
      let options = {
        skip: skip,
        limit: pageSize,
        sort: { update_time: -1 },
      };
      TimeAxis.find(conditions, fields, options, (error, result) => {
        if (err) {
          console.error('Error:' + error);
          // throw error;
        } else {
          responseData.list = result;
          responseClient(res, 200, 0, '操作成功！', responseData);
        }
      });
    }
  });
};

exports.addTimeAxis = (req, res) => {
  let { user_id, title, title_id, type, content, coverSrc, state, start_time, end_time } = req.body;
  // TimeAxis.findOne({
  //   title,
  // })
  //   .then(result => {
  // if (!result) {
  let timeAxis = new TimeAxis({
    user_id,
    title,
    title_id,
    type,
    content,
    coverSrc
    // start_time,
    // end_time,
  });
  timeAxis
    .save()
    .then(data => {
      responseClient(res, 200, 0, '操作成功！', data);
    })
    .catch(err => {
      console.error('err :', err);
      // throw err;
    });
  // } 
  // else {
  //   responseClient(res, 200, 1, '该时间轴内容已存在');
  // }
  // })
  // .catch(errro => {
  //   console.error('errro :', errro);
  //   responseClient(res);
  // });
};

exports.updateTimeAxis = (req, res) => {
  console.log(req.body)
  let { user_id, title, content, title_id, type} = req.body;

  TimeAxis.updateOne(
    { 
      user_id,
      title_id,
      type
     },
    {
      // user_id,
      title,
      content,
      // title_id,
      type: 13,
      update_time: new Date(),
    },
  )
    .then(result => {
      console.log(result);
      responseClient(res, 200, 0, '操作成功', result);
    })
    .catch(err => {
      console.error('err:', err);
      responseClient(res);
    });
};

exports.delTimeAxis = (req, res) => {
  let { _id, user_id, title, title_id, type } = req.body;
  if (_id) {
    TimeAxis.deleteOne({ _id }).then(result => {
      responseClient(res, 200, 0, '操作成功!', '删除成功');
    }).catch(err => {
      console.error('err :', err);
      responseClient(res);
    })
  } else {
    TimeAxis.deleteMany({ user_id, title, title_id, type })
      .then(result => {
        responseClient(res, 200, 0, '操作成功!');
        // console.log('result :', result)
        // if (result.n === 1) {
        //   responseClient(res, 200, 0, '操作成功!');
        // } else {
        //   responseClient(res, 200, 1, '时间轴内容不存在');
        // }
      })
      .catch(err => {
        console.error('err :', err);
        responseClient(res);
      });
  }

};

// 详情
exports.getTimeAxisDetail = (req, res) => {
  let { id } = req.body;
  TimeAxis.findOne({ _id: id })
    .then(data => {
      responseClient(res, 200, 0, '操作成功！', data);
    })
    .catch(err => {
      console.error('err :', err);
      responseClient(res);
    });
};

// 查询是否点赞和收藏
exports.searchTimeAxis = (req, res) => {
  const { user_id, title_id } = req.query
  TimeAxis.find({ user_id, title_id }).then(data => {
    console.log(data)
    responseClient(res, 200, 0, '操作成功！', data);
  }).catch(err => {
    console.error('err :', err);
    responseClient(res);
  });
}
