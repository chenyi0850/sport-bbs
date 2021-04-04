import { responseClient } from '../util/util'
const crawler = require('../crawler')

let products = []
crawler.products.then(res => products = res)

exports.getProducts = (req, res) => {
    responseClient(res, 200, 0, '操作成功 ！', products)
}
