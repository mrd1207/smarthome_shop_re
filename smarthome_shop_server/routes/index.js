import express, {
    response
} from 'express'
const router = express.Router({})
import conn from './../db/db'
import config from '../src/config'
import sms_util from './../util/sms_util'
import svgCaptcha from 'svg-captcha'
import md5 from 'blueimp-md5'
import formidable from 'formidable'
import {
    basename
} from 'path'
const S_KEY = '@WaLQ1314?.LqFtK.Com.#'; // 盐
const users = {}; // 用户信息
let tmp_captcha = '';
/* GET home page. */
router.get('/', (req, res, next) => {
    console.log(md5(md5("admin") + S_KEY))
    res.render('index', {
        title: '西二商城'
    });
});
/********************************前台************************************** */
/**
 * 获取首页轮播图
 */
router.get('/homecasual', (req, res) => {
    let sqlStr = 'SELECT * FROM homecasual';
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({
                err_code: 0,
                message: '请求轮播图数据失败'
            });
            console.log(error);
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({
                success_code: 200,
                message: results
            });
        }
    });
});
/**
 * 获取商品分类数
 */
router.get('/category', (req, res) => {
    let sqlStr = 'SELECT * FROM category';
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({
                err_code: 0,
                message: '请求商品分类数据失败'
            });
            console.log(error);
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({
                success_code: 200,
                message: results
            });
        }
    });
});
/**
 * 模糊搜索(商品名称)
 */
router.post('/searchgoods', (req, res) => {
    // 获取参数
    let keywords = req.body.keywords;
    console.log('keywords: ', keywords);
    keywords = keywords.replace(/\s+/g, ' ');
    keywords = keywords.replace(/(^\s*)|(\s*$)/g, '');
    let keyArr = keywords.split(' ');
    let sqlStr = 'SELECT * FROM recommend WHERE goods_name LIKE '; // sql语句
    keyArr.forEach((item, index, arr) => {
        sqlStr += "'%" + item + "%'";
        if (index != arr.length - 1) {
            sqlStr += " OR goods_name LIKE ";
        }
    });
    conn.query(sqlStr, (error, results, fields) => {
        results = JSON.parse(JSON.stringify(results));
        if (!error && results.length) {
            res.json({
                success_code: 200,
                message: results
            });
        } else {
            console.log(error);
        }
    });
});
/**
 * 获取推荐商品列表
 *  1, 3
 */
router.get('/recommendshoplist', (req, res) => {
    // 获取参数
    let category = req.query.category || 1;
    let pageNo = req.query.pageNo || 1;
    let pageSize = req.query.count || 12;
    let sqlStr = 'SELECT * FROM recommend WHERE category = ' + category + ' LIMIT ' + (pageNo - 1) * pageSize + ',' + pageSize;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({
                err_code: 0,
                message: '请求商品列表数据失败'
            });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({
                success_code: 200,
                message: results
            });
        }
    });
});
/**
 * 获取所有商品
 */
router.get('/allgoods', (req, res) => {
    let sqlStr = 'SELECT * FROM recommend';
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({
                err_code: 0,
                message: '请求商品数据失败'
            });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({
                success_code: 200,
                message: results
            });
        }
    });
});
/**
 * 获取首页商品列表
 */
router.get('/homeshoplist', (req, res) => {
    // 获取总分类
    let cateSqlStr = 'SELECT COUNT(*) FROM category';
    conn.query(cateSqlStr, (error, results, fields) => {
        if (!error) {
            let sqlStr = '';
            for (let i = 0; i < results[0]['COUNT(*)']; i++) {
                sqlStr += 'SELECT * FROM recommend WHERE category = ' + (i + 1) + ' LIMIT 4;';
            }
            conn.query(sqlStr, (error, results, fields) => {
                if (!error) {
                    results = JSON.parse(JSON.stringify(results));
                    console.log('results: ', results);
                    res.json({
                        success_code: 200,
                        message: results
                    });
                }
            });
        }
    });
});
/**
 * 获取商品详细信息
 */
router.get('/goodsdetail', (req, res) => {
    // 获取参数
    let goodsNo = req.query.goodsNo;
    let sqlStr = 'SELECT * FROM recommend WHERE goods_id = ' + goodsNo;
    conn.query(sqlStr, (error, results, fields) => {
        if (!error) {
            results = JSON.parse(JSON.stringify(results));
            res.json({
                success_code: 200,
                message: results
            });
        }
    });
});
//收藏状态
router.get('/get_collection_state', (req, res) => {
    // 获取参数
    let goods_id = req.query.goods_id;
    console.log('goods_id: ', goods_id);
    let user_id = req.query.user_id;
    let sqlStr = 'SELECT * FROM goods_collection WHERE goods_id = ' + goods_id + ' AND user_id = ' + user_id;
    conn.query(sqlStr, (error, results, fields) => {
        results = JSON.parse(JSON.stringify(results));
        if (error) {
            console.log(error);
        }
        if (results) {
            res.json({

                err_code: 0,
                message: '未收藏状态!'
            });
        } else {
            res.json({
                success_code: 200,
                message: '已收藏状态!'
            });
        }

    });
});
router.get('/get_collection', (req, res) => {
    // 获取参数
    let user_id = req.query.user_id;
    let sqlStr = 'SELECT * FROM goods_collection WHERE user_id = ' + user_id;
    conn.query(sqlStr, (error, results, fields) => {
        if (!error) {
            results = JSON.parse(JSON.stringify(results));
            res.json({
                success_code: 200,
                message: results
            });
        }
    });
});
/// 添加收藏
router.post('/add_collection', (req, res) => {
    // 验证用户
    let user_id = req.body.user_id;
    console.log('collect_user_id: ', user_id);
    if (!user_id) {
        res.json({
            err_code: 0,
            message: '非法用户'
        });
        return;
    }
    // 获取客户端传过来的商品信息
    let goods_id = req.body.goods_id;
    let goods_name = req.body.goods_name;
    let goods_pic = req.body.goods_pic;
    let goods_price = req.body.goods_price;
    let add_sql = "INSERT INTO goods_collection(user_id, goods_id, goods_name, goods_pic, goods_price) VALUES (?, ?, ?, ?, ?)";
    let sql_params = [user_id, goods_id, goods_name, goods_pic, goods_price];
    console.log('sql_params: ', sql_params);
    conn.query(add_sql, sql_params, (error, results, fields) => {
        if (error) {
            res.json({
                err_code: 0,
                message: '添加失败!'
            });
            console.log(error);
        } else {
            res.json({
                success_code: 200,
                message: '添加成功!'
            });
        }
    });
});
// 删除收藏
router.post('/del_collection', (req, res) => {
    // 获取数据
    const user_id = req.body.user_id;
    const goods_id = req.body.goods_id;
    let sqlStr = "DELETE FROM goods_collection WHERE user_id =" + user_id + " AND goods_id = " + goods_id;
    conn.query(sqlStr, (error, results, fields) => {
        console.log('sqlStr: ', sqlStr);
        if (error) {
            console.log(error);
            res.json({
                err_code: 0,
                message: '删除失败!'
            });
        } else {
            res.json({
                success_code: 200,
                message: '删除成功!'
            });
        }
    });
});

/**
 * 获取商品评价
 */
router.get('/goodscomment', (req, res) => {
    // 获取参数
    let goodsId = req.query.goodsId;
    let sqlStr = 'SELECT user_info.id, user_info.user_name, user_info.user_nickname, comments.comment_detail, comments.comment_id, comments.comment_rating, comments.goods_id FROM user_info INNER JOIN comments ON user_info.id = comments.user_id WHERE goods_id = ' + goodsId;
    conn.query(sqlStr, (error, results, fields) => {
        if (!error) {
            results = JSON.parse(JSON.stringify(results));
            res.json({
                success_code: 200,
                message: results
            });
        }
    });
});

/**
 * 评论商品
 */
router.post('/postcomment', (req, res) => {
    // 获取参数
    let goods_id = req.body.goods_id;
    console.log('goods_id: ', goods_id);
    let comment_detail = req.body.comment_detail;
    let comment_rating = req.body.comment_rating;
    let user_id = req.body.user_id;

    const addSql = "INSERT INTO comments(goods_id, comment_detail, comment_rating, user_id) VALUES (?, ?, ?, ?)";
    const addSqlParams = [goods_id, comment_detail, comment_rating, user_id];
    conn.query(addSql, addSqlParams, (error, results, fields) => {
        console.log(error);
        results = JSON.parse(JSON.stringify(results));
        if (!error) {
            // 更新数据
            let sqlStr = "UPDATE recommend SET comments_count = comments_count + 1 WHERE goods_id = " + goods_id;
            conn.query(sqlStr, (error, results, fields) => {
                if (error) {
                    console.log(error);
                } else {
                    res.json({
                        success_code: 200,
                        message: "发布成功"
                    });
                }
            });
        }
    });
});
/**
 一次性图形验证码
*/
router.get('/api/captcha', (req, res) => {
    // 生成随机验证码
    let captcha = svgCaptcha.create({
        color: true,
        noise: 3,
        ignoreChars: '0o1iIO',
        size: 4
    });
    // 保存
    req.session.captcha = captcha.text.toLocaleLowerCase();
    tmp_captcha = captcha.text.toLocaleLowerCase();
    // 返回客户端
    res.type('svg');
    res.send(captcha.data);
});
/**
  发送验证码短信
*/
router.get('/api/send_code', (req, res) => {
    // 获取手机号码
    let phone = req.query.phone;
    // 随机产生验证码
    let code = sms_util.randomCode(6);
    setTimeout(() => {
        users[phone] = code;
        res.json({
            success_code: 200,
            message: code
        });
    }, 2000);
});

/**
  手机验证码登录
*/
router.post('/api/login_code', (req, res) => {
    // 获取数据
    const phone = req.body.phone;
    const code = req.body.code;
    // 验证验证码是否正确
    if (users[phone] !== code) {
        res.json({
            err_code: 0,
            message: '验证码不正确!'
        });
    }

    // 查询数据
    delete users[phone];

    let sqlStr = "SELECT * FROM user_info WHERE user_phone = '" + phone + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({
                err_code: 0,
                message: '查询失败'
            });
            console.log(error);
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (results[0]) { // 用户已经存在
                req.session.userId = results[0].id;
                res.json({
                    success_code: 200,
                    message: {
                        id: results[0].id,
                        user_name: results[0].user_name,
                        user_nickname: results[0].user_nickname || '',
                        user_phone: results[0].user_phone,
                        user_sex: results[0].user_sex,
                        user_address: results[0].user_address,
                        user_sign: results[0].user_sign,
                        user_birthday: results[0].user_birthday,
                        user_avatar: results[0].user_avatar
                    }
                });
            } else { // 新用户
                const addSql = "INSERT INTO user_info(user_name, user_phone, user_avatar) VALUES (?, ?, ?)";
                const addSqlParams = [phone, phone, 'http://localhost:' + config.port + '/avatar_uploads/']; // 手机验证码注册，默认用手机号充当用户名
                conn.query(addSql, addSqlParams, (error, results, fields) => {
                    results = JSON.parse(JSON.stringify(results));
                    if (!error) {
                        req.session.userId = results.insertId;
                        let sqlStr = "SELECT * FROM user_info WHERE id = '" + results.insertId + "' LIMIT 1";
                        conn.query(sqlStr, (error, results, fields) => {
                            if (error) {
                                res.json({
                                    err_code: 0,
                                    message: '注册失败'
                                });
                                console.log(error);
                            } else {
                                results = JSON.parse(JSON.stringify(results));

                                res.json({
                                    success_code: 200,
                                    message: {
                                        id: results[0].id,
                                        user_name: results[0].user_name,
                                        user_phone: results[0].user_phone,
                                        user_avatar: results[0].user_avatar
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});

/**
 * 用户名和密码登录
 */
router.post('/login_pwd', (req, res) => {
    // 获取数据
    const user_name = req.body.name;
    const user_pwd = md5(md5(req.body.pwd) + S_KEY);
    // const user_pwd = req.body.pwd;
    const captcha = req.body.captcha.toLowerCase();

    // 验证图形验证码是否正确
    if (captcha !== tmp_captcha) {

        res.json({
            err_code: 0,
            message: '图形验证码不正确!'
        });
        return;
    }
    tmp_captcha = '';
    // 查询数据
    let sqlStr = "SELECT * FROM user_info WHERE user_name = '" + user_name + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({
                err_code: 0,
                message: '用户名不正确!'
            });
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (results[0]) { // 用户已经存在
                // 验证密码是否正确
                if (results[0].user_pwd !== user_pwd) {
                    res.json({
                        err_code: 0,
                        message: '密码不正确!'
                    });
                } else {
                    req.session.userId = results[0].id;
                    console.log('req.session.userId: ', req.session.userId);
                    res.json({
                        success_code: 200,
                        message: {
                            id: results[0].id,
                            user_name: results[0].user_name || '',
                            user_nickname: results[0].user_nickname || '',
                            user_phone: results[0].user_phone || '',
                            user_sex: results[0].user_sex || '',
                            user_address: results[0].user_address || '',
                            user_sign: results[0].user_sign || '',
                            user_birthday: results[0].user_birthday || '',
                            user_avatar: results[0].user_avatar || ''
                        },
                        info: '登录成功!'
                    });
                }
            } else { // 新用户
                const addSql = "INSERT INTO user_info(user_name, user_pwd, user_avatar) VALUES (?, ?, ?)";
                const addSqlParams = [user_name, user_pwd, 'http://localhost:' + config.port + '/avatar_uploads/avatar_default.jpg'];
                conn.query(addSql, addSqlParams, (error, results, fields) => {
                    results = JSON.parse(JSON.stringify(results));
                    if (!error) {
                        req.session.userId = results.insertId;
                        let sqlStr = "SELECT * FROM user_info WHERE id = '" + results.insertId + "' LIMIT 1";
                        conn.query(sqlStr, (error, results, fields) => {
                            if (error) {
                                res.json({
                                    err_code: 0,
                                    message: '注册失败'
                                });
                            } else {
                                results = JSON.parse(JSON.stringify(results));

                                res.json({
                                    success_code: 200,
                                    message: {
                                        id: results[0].id,
                                        user_name: results[0].user_name || '',
                                        user_nickname: results[0].user_nickname || '',
                                        user_avatar: results[0].user_avatar || ''
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});

/**
 *  根据session中的用户id获取用户信息
 * */
router.get('/user_info', (req, res) => {
    // 获取参数
    let userId = req.query.user_id || req.session.userId;
    console.log('userId: ', userId);
    let sqlStr = "SELECT * FROM user_info WHERE id = " + userId + " LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({
                err_code: 0,
                message: '请求用户数据失败'
            });
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (!results[0]) {
                delete req.session.userId;
                res.json({
                    error_code: 1,
                    message: '请先登录'
                });
            } else {
                res.json({
                    success_code: 200,
                    message: {
                        id: results[0].id,
                        user_name: results[0].user_name || '',
                        user_nickname: results[0].user_nickname || '',
                        user_phone: results[0].user_phone || '',
                        user_sex: results[0].user_sex || '',
                        user_address: results[0].user_address || '',
                        user_sign: results[0].user_sign || '',
                        user_birthday: results[0].user_birthday || '',
                        user_avatar: results[0].user_avatar || ''
                    },
                });
            }
        }
    });
});

/**
 * 退出登录
 */
router.get('/logout', (req, res) => {
    // 清除session中userId
    delete req.session.userId;
    res.json({
        success_code: 200,
        message: "退出登录成功"
    });
});

router.post('/add_shop_cart', (req, res) => {
    // 验证用户
    let user_id = req.body.user_id;
    if (!user_id) {
        res.json({
            err_code: 0,
            message: '非法用户'
        });
        return;
    }
    // 获取客户端传过来的商品信息
    let goods_id = req.body.goods_id;
    let goods_name = req.body.goods_name;
    let thumb_url = req.body.thumb_url;
    let price = req.body.price;
    let buy_count = req.body.buy_count;
    let is_pay = 0; // 0 未购买 1购买
    let counts = req.body.counts;
    let sql_str = "SELECT * FROM cart WHERE goods_id = " + goods_id + " AND user_id=" + user_id + " LIMIT 1";
    conn.query(sql_str, (error, results, fields) => {
        if (error) {
            res.json({
                err_code: 0,
                message: '服务器内部错误!'
            });
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (results[0]) { // 商品已经存在
                res.json({
                    success_code: 200,
                    message: '该商品已在购物车中'
                });
            } else { // 商品不存在
                let add_sql = "INSERT INTO cart(goods_id, goods_name, thumb_url, price, buy_count, is_pay, user_id, counts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                let sql_params = [goods_id, goods_name, thumb_url, price, buy_count, is_pay, user_id, counts];
                conn.query(add_sql, sql_params, (error, results, fields) => {
                    if (error) {
                        res.json({
                            err_code: 0,
                            message: '加入购物车失败!'
                        });
                        console.log(error);
                    } else {
                        res.json({
                            success_code: 200,
                            message: '加入购物车成功!'
                        });
                    }
                });
            }
        }
    });
});
/**
 * 查询购物车的商品
 */
router.get('/cart_goods', (req, res) => {
    // 获取参数
    let user_id = req.query.user_id;
    console.log('user_id: ', user_id);
    let sqlStr = "SELECT * FROM cart WHERE user_id =" + user_id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({
                err_code: 0,
                message: '请求购物车商品数据失败'
            });
        } else {
            res.json({
                success_code: 200,
                message: results
            });
        }
    });
});

/**
 * 删除购物车单条商品
 */
router.post('/delete_goods', (req, res) => {
    // 获取数据
    const goods_id = req.body.goods_id;
    const user_id = req.body.user_id;
    let sqlStr = "DELETE FROM cart WHERE goods_id =" + goods_id + " AND user_id = " + user_id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({
                err_code: 0,
                message: '删除失败!'
            });
        } else {
            res.json({
                success_code: 200,
                message: '删除成功!'
            });
        }
    });
});

/*********************************** 用户中心 **************************************** */

/**
 * 修改用户信息 
 */
router.post('/change_user_msg', (req, res) => {
    // console.log(req.body.id);
    // 获取客户端传过来的商品信息
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadsAvatarPath; // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(err);
        }
        let id = fields.id;
        let user_nickname = fields.user_nickname || '';
        let user_sex = fields.user_sex || '';
        let user_address = fields.user_address || '';
        let user_birthday = fields.user_birthday || '';
        let user_phone = fields.user_phone || '';
        console.log('user_birthday: ', user_birthday);
        let user_sign = fields.user_sign || '';
        // let user_avatar = "default_avatar";
        let sqlStr = "";
        let strParams = [];
        // 验证
        if (!id) {
            res.json({
                err_code: 0,
                message: '修改用户信息失败!'
            });
        }
        if (files.user_avatar) {
            user_avatar = 'http://localhost:' + config.port + '/avatar_uploads/' + basename(files.user_avatar.path);
            console.log('12user_avatar: ', user_avatar);
            sqlStr = "UPDATE user_info SET user_nickname = ? , user_sex = ?, user_address = ?, user_birthday = ?, user_sign = ?, user_avatar = ?,user_phone = ? WHERE id = " + id;
            strParams = [user_nickname, user_sex, user_address, user_birthday, user_sign, user_avatar, user_phone];
        } else {
            sqlStr = "UPDATE user_info SET user_nickname = ? , user_sex = ?, user_address = ?, user_birthday = ?, user_sign = ? , user_phone = ?  WHERE id = " + id;
            strParams = [user_nickname, user_sex, user_address, user_birthday, user_sign, user_phone];

        }

        conn.query(sqlStr, strParams, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.json({
                    err_code: 0,
                    message: '修改用户信息失败!'
                });
            } else {
                res.json({
                    success_code: 200,
                    message: '修改用户信息成功!'
                });
            }
        });
    });
});

/**
 * 修改用户密码
 */
router.post('/change_user_pwd', (req, res) => {
    // 获取数据
    let id = req.body.id;
    let oriPwd = '';
    let newPwd = md5(md5(req.body.newPwd) + S_KEY);
    if (req.body.oriPwd) {
        oriPwd = md5(md5(req.body.oriPwd) + S_KEY);
    }

    let sqlStr = "SELECT * FROM user_info WHERE id = " + id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({
                err_code: 0,
                message: '查询失败!'
            });
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (results[0]) { // 用户存在
                if (!results[0].user_pwd || (results[0].user_pwd && oriPwd === results[0].user_pwd)) {
                    let sqlStr = "UPDATE user_info SET user_pwd = ? WHERE id = " + id;
                    conn.query(sqlStr, [newPwd], (error, results, fields) => {
                        if (!error) {
                            res.json({
                                success_code: 200,
                                message: '密码修改成功!'
                            });
                        }
                    });
                } else if (oriPwd != results[0].user_pwd) {
                    res.json({
                        err_code: 0,
                        message: '输入的原始密码错误!'
                    });
                }
            } else {
                res.json({
                    err_code: 0,
                    message: '非法用户!'
                });
            }
        }
    });
});

/**
  修改手机
*/
router.post('/api/change_user_phone', (req, res) => {
    // 获取数据
    const id = req.body.id;
    const phone = req.body.phone;
    const code = req.body.code;
    // 验证验证码是否正确
    if (users[phone] !== code) {
        res.json({
            err_code: 0,
            message: '验证码不正确!'
        });
    }
    // 查询数据
    delete users[phone];
    let sqlStr = "UPDATE user_info SET user_phone = " + phone + " WHERE id = " + id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({
                err_code: 0,
                message: '修改失败'
            });
            console.log(error);
        } else {
            res.json({
                success_code: 200,
                message: '修改成功'
            });
        }
    });
});

/********************************* 后台管理系统 ********************************** */

/**
 * 管理员登录
 */
router.post('/admin_login', (req, res) => {
    const account = req.body.account;
    console.log('account: ', account);
    const pwd = req.body.pwd;
    console.log('pwd: ', pwd);
    const md5Pwd = md5(md5(req.body.pwd) + S_KEY);

    if (!account || !pwd) {
        res.json({
            error_code: 0,
            message: "账号和密码不得为空！"
        });
    }
    let sqlStr = "SELECT * FROM administrators WHERE account = '" + account + "'";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({
                error_code: 0,
                message: "服务器内部错误！"
            });
        } else if (results[0]) {
            let user = JSON.parse(JSON.stringify(results[0]));
            if (md5Pwd === user['pwd']) {
                req.session.adminId = user['id'];
                res.json({
                    success_code: 200,
                    message: "登录成功！"
                });
            } else {
                res.json({
                    error_code: 0,
                    message: "密码错误！"
                });
            }
        } else {
            res.json({
                err_code: 0,
                message: "用户不存在！"
            });
        }
    });
});

/**
 * 管理员退出登录
 */
router.get('/admin_logout', (req, res) => {
    console.log(req.session.adminId)
    delete req.session.adminId;

    res.json({
        success_code: 200,
        message: "退出登录成功"
    });
});

/**
 * 修改商品数量 
 */
router.post('/change_goods_count', (req, res) => {
    // 获取数据
    const goods_id = req.body.goods_id;
    const buy_count = req.body.count;
    const user_id = req.body.user_id;

    let sqlStr = "UPDATE cart SET buy_count = ? WHERE goods_id = " + goods_id + " AND user_id = " + user_id;
    let strParams = [buy_count];
    conn.query(sqlStr, strParams, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({
                err_code: 0,
                message: '修改商品数量失败!'
            });
        } else {
            res.json({
                success_code: 200,
                message: '修改商品数量成功!'
            });
        }
    });
});

/**
 * 获取所有用户信息
 */
router.get('/admin_allusers', (req, res) => {

    let sqlStr = 'SELECT id, user_name, user_phone, user_nickname, user_address FROM user_info';

    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({
                err_code: 0,
                message: '请求用户数据失败'
            });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({
                success_code: 200,
                message: results
            });
        }
    });
});
/**
 * 删除recommend单条商品
 */
router.post('/delete_recom_goods', (req, res) => {
    // 获取数据
    const goods_id = req.body.goods_id;
    let sqlStr = "DELETE FROM recommend WHERE goods_id =" + goods_id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({
                err_code: 0,
                message: '删除失败!'
            });
        } else {
            let sqlStr2 = "DELETE FROM cart WHERE goods_id =" + goods_id;
            conn.query(sqlStr, (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.json({
                        err_code: 0,
                        message: '删除失败!'
                    });
                } else {
                    res.json({
                        success_code: 200,
                        message: '删除成功!'
                    });
                }
            });
        }
    });
});
/**
 * 修改recommend商品信息 
 */
router.post('/update_recom_goods', (req, res) => {
    // 获取数据
    const goods_id = req.body.goods_id;
    const goods_name = req.body.goods_name;
    const short_name = req.body.short_name;
    const price = req.body.price;
    const counts = req.body.counts;
    const category = req.body.category;
    let sqlStr = "UPDATE recommend SET goods_name = ?, short_name = ?, price = ?, counts = ?, category = ? WHERE goods_id = " + goods_id;
    let strParams = [goods_name, short_name, price, counts, category];
    conn.query(sqlStr, strParams, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({
                err_code: 0,
                message: '修改失败!'
            });
        } else {
            res.json({
                success_code: 200,
                message: '修改成功!'
            });
        }
    });
});
/**
 * 添加商品到recommend
 */
router.post('/add_shop_recom', (req, res) => {
    // 获取客户端传过来的商品信息
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadsGoodsPath; // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, (err, fields, files) => {
        console.log('req: ', req);
        if (err) {
            return next(err);
        }
        let goods_id = fields.goods_id;
        let goods_name = fields.goods_name;
        let short_name = fields.short_name;
        let price = fields.price;
        let normal_price = price + 300;
        let market_price = price + 500;
        let sales_tip = fields.sales_tip;
        let category = fields.category;
        let comments_count = 0;
        let counts = fields.counts;
        let thumb_url = 'http://localhost:' + config.port + '/uploads/' + basename(files.goods_img.path);
        let image_url = 'http://localhost:' + config.port + '/uploads/' + basename(files.goods_img.path);
        let hd_thumb_url = 'http://localhost:' + config.port + '/uploads/' + basename(files.goods_img.path);
        let sql_str = "SELECT * FROM recommend WHERE goods_id = " + goods_id;
        conn.query(sql_str, (error, results, fields) => {
            if (error) {
                res.json({
                    err_code: 0,
                    message: '服务器内部错误!'
                });
            } else {
                results = JSON.parse(JSON.stringify(results));
                if (results[0]) { // 商品已经存在
                    res.json({
                        success_code: 500,
                        message: '该商品已在数据库中'
                    });
                } else { // 商品不存在
                    let add_sql = "INSERT INTO recommend(goods_id, goods_name, short_name, thumb_url, image_url, hd_thumb_url, price, normal_price, market_price, sales_tip, category, counts, comments_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    let sql_params = [goods_id, goods_name, short_name, thumb_url, image_url, hd_thumb_url, price, normal_price, market_price, sales_tip, category, counts, comments_count];
                    conn.query(add_sql, sql_params, (error, results, fields) => {
                        if (error) {
                            console.log(error);
                            res.json({
                                err_code: 0,
                                message: '加入失败!'
                            });
                        } else {
                            let sqlStr = "UPDATE category SET cate_counts = cate_counts + 1  WHERE cate_id = " + category;
                            conn.query(sqlStr, [], (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    res.json({
                                        success_code: 200,
                                        message: '加入成功!'
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    });
});
/**
 * 删除所有商品
 */
router.post('/delete_all_goods', (req, res) => {
    // 获取数据
    const user_id = req.body.user_id;
    let sqlStr = "DELETE FROM cart WHERE user_id = " + user_id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({
                err_code: 0,
                message: '删除失败!'
            });
        } else {
            res.json({
                success_code: 200,
                message: '删除成功!'
            });
        }
    });
});
/********************************* 订单 ********************************** */
// 地址管理
/**
 *  根据session中的用户id获取用户信息
 * */
router.get('/user_address', (req, res) => {
    // 获取参数
    let userId = req.query.user_id || req.session.userId;
    // let address=cartToOrder[0].goods_id;
    // console.log('address: ', address);
    console.log('userId: ', userId);
    let sqlStr = "SELECT * FROM tb_address WHERE id = " + userId;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({
                err_code: 0,
                message: '请求用户数据失败'
            });
        } else {
            results = JSON.parse(JSON.stringify(results));
            console.log('results: ', results);
            if (!results) {
                delete req.session.userId;
                res.json({
                    error_code: 1,
                    message: '请先登录'
                });
            } else {
                res.json({
                    success_code: 200,
                    message: results
                });
            }
        }
    });
});
//修改收货地址
router.post('/update_address', (req, res) => {
    // 获取数据
    const address_id = req.body.address_id;
    const real_name = req.body.real_name;
    const street_name = req.body.street_name;
    const tel = req.body.tel;
    let sqlStr = "UPDATE tb_address SET real_name = ?, street_name = ?, tel = ? WHERE address_id = " + address_id;
    let strParams = [real_name, street_name, tel];
    conn.query(sqlStr, strParams, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({
                err_code: 0,
                message: '修改失败!'
            });
        } else {
            res.json({
                success_code: 200,
                message: '修改成功!'
            });
        }
    });
});
// 增加地址
router.post('/add_address', (req, res) => {
    // 验证用户
    let user_id = req.body.id;
    if (!user_id) {
        res.json({
            err_code: 0,
            message: '非法用户'
        });
        return;
    }
    // 获取客户端传过来的商品信息
    let real_name = req.body.real_name;
    let tel = req.body.tel;
    let area_name = req.body.area_name;
    let street_name = req.body.street_name;
    let is_default = 0; // 默认地址
    let add_sql = "INSERT INTO tb_address(id, real_name, tel, area_name, street_name, is_default) VALUES (?, ?, ?, ?, ?, ?)";
    let sql_params = [user_id, real_name, tel, area_name, street_name, is_default];
    console.log('sql_params: ', sql_params);
    conn.query(add_sql, sql_params, (error, results, fields) => {
        if (error) {
            res.json({
                err_code: 0,
                message: '添加失败!'
            });
            console.log(error);
        } else {
            res.json({
                success_code: 200,
                message: '添加成功!'
            });
        }
    });
});
router.post('/delete_address', (req, res) => {
    // 获取数据

    const address_id = req.body.address_id;
    let sqlStr = "DELETE FROM tb_address WHERE address_id =" + address_id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({
                err_code: 0,
                message: '删除失败!'
            });
        } else {
            res.json({
                success_code: 200,
                message: '删除成功!'
            });
        }
    });
});
// 生成订单
router.post('/create_order', (req, res) => {
    let response = 0;
    // 用户参数
    let user_id = req.body.user_id;
    let address = req.body.address;

    // 地址参数
    let receiver_name = req.body.address.real_name;
    let receiver_phone = req.body.address.tel;
    let area = req.body.address.area_name.split(' ');
    let receiver_city = area[0];
    let receiver_district = area[1];
    let receiver_address = req.body.address.street_name;

    // 订单参数
    let buyer_nick = req.body.buyer_nick;
    let status = 0;
    let create_time = new Date().toLocaleString();
    let order_id = '';
    let payment = req.body.payment;
    if (user_id) {
        // 生成订单号
        for (let i = 0; i < 2; i++) {
            order_id += Math.floor(Math.random() * 10);
        }
        order_id = new Date().getTime() + order_id;
        console.log("xxx");

    }

    // 商品参数
    let cartToOrder = req.body.cartToOrder;

    for (let i = 0; i < cartToOrder.length; i++) {
        let item_id = cartToOrder[i].goods_id;
        let num = cartToOrder[i].buy_count;
        let title = cartToOrder[i].goods_name;
        let price = cartToOrder[i].price;
        let total_fee = cartToOrder[i].price * cartToOrder[i].buy_count;
        let pic_path = cartToOrder[i].thumb_url;
        // 插入订单商品表
        const addGoodsSql = "INSERT INTO tb_order_item(item_id, order_id, num, title,price,pic_path,total_fee) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const addGoodsSqlParams = [item_id, order_id, num, title, price, pic_path, total_fee];
        console.log('addGoodsSqlParams: ', addGoodsSqlParams);
        conn.query(addGoodsSql, addGoodsSqlParams, (error, results, fields) => {
            console.log(error);
            results = JSON.parse(JSON.stringify(results));
            console.log('results: ', results);
            if (error) {
                console.log(error);
            } else {
                response++;
            }
        });

    }
    // 插入订单地址表
    const addReceiverSql = "INSERT INTO tb_order_shipping(order_id, receiver_name, receiver_phone,receiver_city,receiver_district,receiver_address) VALUES (?, ?, ?, ?, ?, ?)";
    const addReceiverSqlParams = [order_id, receiver_name, receiver_phone, receiver_city, receiver_district, receiver_address];
    console.log('addReceiverSqlParams: ', addReceiverSqlParams);
    conn.query(addReceiverSql, addReceiverSqlParams, (error, results, fields) => {
        console.log(error);
        results = JSON.parse(JSON.stringify(results));
        console.log('results: ', results);
        if (error) {
            console.log(error);
        } else {
            response++;
        }
    });
    const addOrderSql = "INSERT INTO tb_order(order_id, user_id, buyer_nick, status,payment,create_time,goods_count) VALUES (?, ?, ?, ?, ?, ? , ?)";
    const aaddOrderSqlParams = [order_id, user_id, buyer_nick, status, payment, create_time, cartToOrder.length];
    console.log('aaddOrderSqlParams: ', aaddOrderSqlParams);
    conn.query(addOrderSql, aaddOrderSqlParams, (error, results, fields) => {
        console.log(error);
        results = JSON.parse(JSON.stringify(results));
        console.log('results: ', results);
        if (error) {
            console.log(error);
        } else {
            response++;
            console.log('response: ', response);

            if (response >= 3) {
                res.json({
                    success_code: 200,
                    message: order_id
                })
            } else {
                res.json({
                    success_code: 0,
                    message: "生成订单失败"
                })
            }

        }
    });
    // 获取总价
    router.get('/get_total', (req, res) => {
        // 获取参数
        let order_id = req.query.order_id;

        console.log('sssuserId: ', order_id);
        let sqlStr = "SELECT payment FROM tb_order WHERE order_id = " + order_id;
        conn.query(sqlStr, (error, results, fields) => {
            if (error) {
                res.json({
                    err_code: 0,
                    message: '请求用户数据失败'
                });
            } else {
                results = JSON.parse(JSON.stringify(results));
                console.log('results: ', results);
                if (!results) {
                    delete req.session.userId;
                    res.json({
                        error_code: 1,
                        message: '请先登录'
                    });
                } else {
                    res.json({
                        success_code: 200,
                        message: results[0]
                    });
                }
            }
        });
    });
});
router.post('/pay_pwd', (req, res) => {
    const user_id = req.body.user_id;
    const input_Pwd = md5(md5(req.body.input_Pwd) + S_KEY);
    let sqlStr = "SELECT * FROM user_info WHERE id = '" + user_id + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        results = JSON.parse(JSON.stringify(results));
        console.log('results: ', results);
        if (results[0].user_pwd !== input_Pwd) {
            res.json({
                err_code: 0,
                message: '密码不正确!'
            });
        } else {
            res.json({
                success_code: 200,
                message: '密码正确!'
            });
        }
    });
});

function getShipments(){
    
}
// 支付
router.post('/update_order', (req, res) => {
    const status = req.body.status;
    console.log('status: ', status);
    const order_id = req.body.order_id;
    console.log('order_id: ', order_id);
    let shipping_name = "";
    let shipping_code = "";
    if (req.body.shipping_name) {
        shipping_name = req.body.shipping_name;
        // 生成物流号
        let vNow = new Date();
        shipping_code += String(vNow.getFullYear());
        if(vNow.getMonth()<9){
            shipping_code += "0" + String(vNow.getMonth() + 1);
        }else{
        shipping_code += String(vNow.getMonth() + 1);
        }
        if(vNow.getDate()<10){
            shipping_code += "0" + String(vNow.getDate());
        }else{
            shipping_code += String(vNow.getDate());
        }
        for (let i = 0; i < 6; i++) {
            shipping_code += Math.floor(Math.random() * 10);
        }
        console.log('shipping_code: ', shipping_code);
    }
    console.log('shipping_code?: ', shipping_code);
    let sqlStr = "";
    let time = new Date().toLocaleString();
    if (status === 1) {
        sqlStr = "UPDATE tb_order SET status = " + status + ", payment_time = " + time + " WHERE order_id = " + order_id;
    } else if (status === "2") {
        sqlStr = `UPDATE tb_order SET status = ${status}, update_time = "${time}",shipping_name = "${shipping_name}", shipping_code = "${shipping_code}" WHERE order_id = ${order_id}`;
        console.log('sqlStr: ', sqlStr);

    } else if (status === 3) {
        sqlStr = "UPDATE tb_order SET status = " + status + ", consign_time = " + time + " WHERE order_id = " + order_id;
    } else if (status === 4) {
        sqlStr = "UPDATE tb_order SET status = " + status + ", end_time = " + time + " WHERE order_id = " + order_id;
    } else if (status === 5) {
        sqlStr = "UPDATE tb_order SET status = " + status + ", close_time = " + time + " WHERE order_id = " + order_id;
    }
    console.log('sqlStr: ', sqlStr);
    conn.query(sqlStr, (error, results, fields) => {
        console.log('sqlStr: ', sqlStr);
        if (error) {
            console.log(error);
        } else {
            res.json({
                success_code: 200,
                message: "修改订单状态成功"
            });
        }
    });
});
// 获取订单信息
router.get('/get_order', (req, res) => {
    // 获取参数
    let user_id = req.query.user_id;

    console.log('userId: ', user_id);
    let sqlStr = "SELECT * FROM tb_order WHERE user_id = " + user_id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({
                err_code: 0,
                message: '请求用户数据失败'
            });
        } else {
            results = JSON.parse(JSON.stringify(results));
            console.log('results: ', results);
            res.json({
                success_code: 200,
                message: results
            });
        }
    });
});
// 获取商品订单信息
router.get('/get_item_order', (req, res) => {
    // 获取参数
    let order_id = req.query.order_id;
    console.log('order_id: ', order_id);

    let sqlStr = "SELECT * FROM tb_order_item WHERE order_id = " + order_id;
    console.log('sqlStr: ', sqlStr);
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({
                err_code: 0,
                message: '请求用户数据失败'
            });
        } else {
            results = JSON.parse(JSON.stringify(results));
            console.log('results: ', results);
            res.json({
                success_code: 200,
                message: results
            });
        }
    });
});
// 获取地址订单信息
router.get('/get_address_order', (req, res) => {
    // 获取参数
    let order_id = req.query.order_id;

    let sqlStr = "SELECT * FROM tb_order_shipping WHERE order_id = " + order_id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({
                err_code: 0,
                message: '请求用户数据失败'
            });
        } else {
            results = JSON.parse(JSON.stringify(results));
            console.log('results: ', results);
            res.json({
                success_code: 200,
                message: results
            });
        }
    });
});

// 后台发货
// 获取地址订单信息
router.get('/get_address_order', (req, res) => {
    // 获取参数
    let order_id = req.query.order_id;

    let sqlStr = "SELECT * FROM tb_order_shipping WHERE order_id = " + order_id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({
                err_code: 0,
                message: '请求用户数据失败'
            });
        } else {
            results = JSON.parse(JSON.stringify(results));
            console.log('results: ', results);
            res.json({
                success_code: 200,
                message: results
            });
        }
    });
});
// 订单信息
router.get('/user_order_list', (req, res) => {
    let pageNo = req.query.pageNo || 1;
    console.log('pageNo: ', pageNo);
    let pageSize = req.query.count || 10;
    let countSqlStr = 'SELECT COUNT(*) FROM tb_order';
    conn.query(countSqlStr, (error, results, fields) => {
        let counts = JSON.parse(JSON.stringify(results))[0]['COUNT(*)'];

        let sqlStr = 'SELECT order_id, payment, status, create_time, buyer_nick, shipping_name, shipping_code,update_time FROM tb_order  LIMIT ' + (pageNo - 1) * pageSize + ',' + pageSize;
        conn.query(sqlStr, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.json({
                    err_code: 0,
                    message: '请求订单列表数据失败'
                });
            } else {
                results = JSON.parse(JSON.stringify(results));
                console.log('results: ', results);
                res.json({
                    success_code: 200,
                    counts: counts,
                    message: results
                });
            }
        });
    });
});
// 修改订单信息update_order_address
router.post('/update_order_address', (req, res) => {
    // 获取数据
    const order_id = req.body.order_id;
    const receiver_name = req.body.address.receiver_name;
    const receiver_phone = req.body.address.receiver_phone;
    const receiver_city = req.body.address.receiver_city;
    const receiver_district = req.body.address.receiver_district;
    const receiver_address = req.body.address.receiver_address;
    let sqlStr = "UPDATE tb_order_shipping SET receiver_name = ?, receiver_phone = ?, receiver_city = ?, receiver_district = ? ,receiver_address = ? WHERE order_id = " + order_id;
    let strParams = [receiver_name, receiver_phone, receiver_city, receiver_district, receiver_address];
    conn.query(sqlStr, strParams, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({
                err_code: 0,
                message: '修改失败!'
            });
        } else {
            res.json({
                success_code: 200,
                message: '修改成功!'
            });
        }
    });
});
export default router;