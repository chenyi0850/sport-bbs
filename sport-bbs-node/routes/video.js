import { responseClient } from '../util/util'
import Multimedia from '../models/multimedia';
import User from "../models/user"
const fs = require("fs")
const path = require("path")
const multer = require('multer')
const upload = multer({ dest: 'uploads/videos' }).single('file')
const ffmpeg = require("fluent-ffmpeg")
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
// console.log(ffmpegInstaller.path, ffmpegInstaller.version);

exports.uploadVideo = (req, res) => {

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // 发生错误
        } else if (err) {
            // 发生错误
        }
        const { originalname, filename, destination, mimetype } = req.file
        const videoPath = req.file.path
        let tempMultimedia = new Multimedia({
            user_id: req.query.user_id,
            name: originalname,
            type: req.query.type,
            src: videoPath
        })
        tempMultimedia
            .save()
            .then(data => {
                const fileType = mimetype.split("/")[1]
                const newPath = destination + "/" + data.id + "." + fileType
                fs.rename(videoPath, newPath, (err) => {
                    if (err) throw err
                    ffmpeg(newPath)
                        .screenshots({
                            timestamps: ["00:01.000"],
                            filename: data.id + '.png',
                            folder: 'uploads/videoCovers',
                            size: '320x192'
                        });
                    Multimedia.findByIdAndUpdate(data._id, {
                        coverSrc: 'http://119.29.3.138/api/getCoverSrc?coverSrc=uploads/videoCovers/' + data.id + '.png',
                        src: newPath
                    }, {new: true},(err, result) => {
                        if (err) {
                            console.log("添加coverSrc失败" + err)
                            responseClient(res, 200, 0, '保存失败', result);
                        } else {
                            console.log("添加coverSrc成功")
                            responseClient(res, 200, 0, '保存成功', result);
                        }
                    })
                })
            }).catch(err => {
                console.log(err)
                responseClient(res);
            })
        // 一切都好
    })
}

exports.getCoverSrc = async (req, res) => {
    fs.readFile(req.query.coverSrc, (err, data) => {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(data);
    })
}


exports.getVideosList = async (req, res) => {
    console.log(req.query)
    let pageNum = parseInt(req.query.pageNum) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
    let type = req.query.type
    let condition = {
        type
    }
    let options = {
        skip: skip,
        limit: pageSize,
        sort: { create_time: -1 },
    }
    let fields = {
        name: 1,
        src: 1,
        coverSrc: 1,
        create_time: 1,
    };
    const count = await Multimedia.countDocuments({})
    Multimedia.find(condition, fields, options, (error, result) => {
        if (error) {
            console.error('Error:' + error);
        } else {
            let responseData = {
                count,
                list: []
            }
            // result.forEach(val => {
            //     val.coverSrc = "http://119.29.3.138/api/" + val.coverSrc
            // })
            responseData.list = result
            responseClient(res, 200, 0, '操作成功！', responseData);
        }
    })
}


exports.getVideo = (req, res) => {
    let videoPath = path.resolve(__dirname, '../' + req.query.src);
    res.sendFile(videoPath);
}


exports.getVideoDetail = async (req, res) => {
    const result = await Multimedia.findOne({ src: req.query.src }).populate({ path: 'comments' })
    responseClient(res, 200, 0, '操作成功！', result);
}

exports.likeVideo = (req, res) => {
    console.log(req.body)
    if (!req.session.userInfo) {
        responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
        return;
    }
    let { id, user_id } = req.body;
    Multimedia.findOne({ _id: id })
        .then(data => {
            let fields = {};
            data.meta.likes = data.meta.likes + 1;
            fields.meta = data.meta;
            let like_users_arr = data.like_users.length ? data.like_users : [];
            User.findOne({ _id: user_id })
                .then(user => {
                    let new_like_user = {};
                    new_like_user.id = user._id;
                    new_like_user.name = user.name;
                    new_like_user.avatar = user.avatar;
                    new_like_user.create_time = user.create_time;
                    new_like_user.type = user.type;
                    new_like_user.introduce = user.introduce;
                    like_users_arr.push(new_like_user);
                    fields.like_users = like_users_arr;
                    Multimedia.update({ _id: id }, fields)
                        .then(result => {
                            responseClient(res, 200, 0, '操作成功！', result);
                        })
                        .catch(err => {
                            console.error('err :', err);
                            throw err;
                        });
                })
                .catch(err => {
                    responseClient(res);
                    console.error('err 1:', err);
                });
        })
        .catch(err => {
            responseClient(res);
            console.error('err 2:', err);
        });
}

exports.delVideo = (req, res) => {
    let { id } = req.body;
    Multimedia.deleteMany({ _id: id })
      .then(result => {
        if (result.n === 1) {
          responseClient(res, 200, 0, '删除成功!', '删除成功');
        } else {
          responseClient(res, 200, 1, '视频不存在');
        }
      })
      .catch(err => {
        console.error('err :', err);
        responseClient(res);
      });
  };