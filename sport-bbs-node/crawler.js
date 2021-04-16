//爬虫
const superagent = require('superagent')
const cheerio = require('cheerio');
const Article = require('./models/article');
const iconv = require('iconv-lite');
const https = require('https');



function getNbaArticle(url) {
    https.get(url, (res) => {
        let chunks = [];
        res.on("data", (chunk) => {
            chunks.push(chunk);
        });

        res.on("end", () => {
            let html = iconv.decode(Buffer.concat(chunks), 'gbk');
            // console.log(html);
            let jq = cheerio.load(html)
            let news = {
                author: "NBA",
                tags: ['60505bef3b4cc315d4cb3ac5', '60505bfa3b4cc315d4cb3ac7']
            }
            news.title = jq('h1').text()
            news.auth_logo = 'nba'
            let content = ''
            jq('p[style="TEXT-INDENT: 2em"]').each((idx, ele) => {
                if(idx === 0) {
                    news.desc = jq(ele).text()
                }
                content += jq(ele).text()
            })
            news.img_url = jq('p[align="center"] img').attr("src")
            news.content = content
            Article.create(news, function(err, res) {
                if(err) {
                    // console.log(err)
                    console.log("err")
                    // console.log(news)
                } else {
                    // console.log(res)
                    console.log("保存成功")
                }
            })
        })
    });
}



async function getData() {
    const data = await superagent.get('https://china.nba.com/news/')
    // console.log(data.text)
    let $ = cheerio.load(data.text)
    // 找到目标数据所在的页面元素，获取数据
    $('div.news-wrap a').each((idx, ele) => {
        // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
        // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
        // 获取新闻网页链接
        console.log($(ele).attr('href').replace('http', 'https'))
        getNbaArticle($(ele).attr('href').replace('http', 'https'))
    });
}
// getData()

async function getAthletics() {
    const data = await superagent.get('http://www.athletics.org.cn/news/')
    let $ = cheerio.load(data.text)
    $('#tab1 div.row').each((idx, ele) => {
        console.log($(ele).find("h2 a").attr('href'), $(ele).find(".news-info-right p").text())
        getArticles($(ele).find("h2 a").attr('href'), $(ele).find("h2 a").text(),"田径", "athletics", ["6079a7bd03ad7177382e69e8"], $(ele).find(".news-info-right p").text())
    })
    console.log($('#tab1 div.row').length)
}
getAthletics()

async function getArticles(url, title, author, auth_logo, tags, desc) {
    const data = await superagent.get(url)
    let $ = cheerio.load(data.text)
    let news = {
        title,
        author,
        auth_logo,
        tags,
        desc
    }
    news.img_url = $('.img-cover').attr('src')
    news.content = $(".main-content p").text()
    // news.content = news.content.replace(/\t/g, "")
    // news.content = news.content.replace('\t\n', "")
    const data2 = await Article.create(news)
}



async function getQuipment() {
    const data = await superagent.get('http://www.shihuo.cn/tuangou#qk=daohang&order=3')
    // console.log(data.text)
    let $ = cheerio.load(data.text)
    let products = []
    // 找到目标数据所在的页面元素，获取数据
    $('#jinpinUl_1 li').each((idx, ele) => {
        // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
        // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
        // 获取新闻网页链接
        products.push({
            href: $(ele).find("a").attr('href'),
            img: $(ele).find("img").attr("src"),
            name: $(ele).find(".h2 a").text(),
            price: $(ele).find(".num").text(),
            z1: $(ele).find(".z1").text(),
            z2: $(ele).find(".z2").text()
        })
    });
    return products
}

exports.products = getQuipment()