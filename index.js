const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
var jwt = require('jsonwebtoken');
//const mysql =  require('./db.js');
//var db = new mysql();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
});

app.use(express.static(__dirname + '/public'));

var a = 0;
var a1 = 0;

connection.connect();

var test = {
    x0: [], //起點X
    y0: [], //起點Y
    x1: [], //終點X
    y1: [], //終點Y
    color: [], //顏色
    lc: [],
    c: [], //筆寬
    ear: [], //橡皮擦
    time: [], //時間
    a: [] //順序    
};
var grapa = {
    x0: [], //起點X
    y0: [], //起點Y
    x1: [], //終點X
    y1: [], //終點Y
    color: [], //顏色
    lw: [], //邊寬粗細
    con: [], //是否空心
    grap: [], //圓或方
    time: [], //時間
    a: [] //順序
};
var id = 0;
let onlineCount = 0;

// 修改 connection 事件
io.on('connection', (socket) => {
    // 有連線發生時增加人數
    onlineCount++;
    // 發送人數給網頁
    io.emit("online", onlineCount);

    socket.on("greet", () => {
        socket.emit("greet", onlineCount);
    });

    socket.on('disconnect', () => {
        // 有人離線了，扣人
        onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1;
        io.emit("online", onlineCount);
    });
    socket.on("greet", () => {
        socket.emit("greet", onlineCount);
    });

    socket.on("send", (msg) => {
        // 如果 msg 內容鍵值小於 2 等於是訊息傳送不完全
        // 因此我們直接 return ，終止函式執行。
        if (Object.keys(msg).length < 2) return;

        // 廣播訊息到聊天室
        io.emit("msg", msg);
    });

    socket.on('disconnect', () => {
        // 有人離線了，扣人
        onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1;
        io.emit("online", onlineCount);
    });
    socket.on('pwd_lost', (data) => {
        console.log(data)
        connection.query('SELECT * FROM `account` ', function (error, ras) {
            if (error) {
                console.log('抓取帳號資料失敗');
            }
            for (var i = 0; i < ras.length; i++) {
                if (data.email == ras[i].email) {
                    connection.query('SELECT * FROM `person_inform` ', function (error, res) {
                        i--;
                        if (error) {
                            console.log('抓取資訊資料失敗');
                        }
                        if (data.nick_name == res[i].nickname) {
                            console.log(i)
                            if (data.mobile == res[i].phone) {
                                if (data.school == res[i].school) {
                                    socket.emit('pwd_lost', ras[i].password) //1 成功
                                } else {
                                    socket.emit('pwd_lost', 5) //5 學校錯誤
                                }
                            } else {
                                socket.emit('pws_lost', 6) //6 電話錯誤
                            }
                        } else {
                            socket.emit('pwd_lost', 7) //7 暱稱錯誤
                        }

                    })
                } else {
                    socket.emit('pwd_lost', 2) //2沒有註冊過的email
                }
            }
        })
    })

    socket.on('note', (data) => {
        token = jwt.verify(data, 'eric21364')
        note = {
            theme: [],
            title: [],
            classify: [],
            keyword: [],
            author: [],
            note_content: [],
            UID: [],
            time: []
        }
        connection.query('SELECT * FROM `note` ', function (error, ras) {
            if (error) {
                console.log('抓取帳號資料失敗');
            }
            for (var i = 0; i < ras.length; i++) {
                if (token.uid == ras[i].UID) {
                    note.theme.push(ras[i].theme);
                    note.title.push(ras[i].title);
                    note.classify.push(ras[i].classify);
                    note.keyword.push(ras[i].keyword);
                    note.author.push(ras[i].author);
                    note.note_content.push(ras[i].note_content);
                    note.UID.push(ras[i].UID);
                    note.time.push(ras[i].time);
                }
            }
            socket.emit('note', note)
        })
    })
    
     socket.on('q_data', (data) => {
        console.log(data)
        q_data = [data.question_title, data.theme,  data.UID, data.question_data]
        connection.query('UPDATE `ask` SET question_title = ? WHERE theme = ? && UID=?&& question_data=? ', q_data, function (error, ras) {
            if (error) {
                console.log('更新資料失敗');
            } else console.log("ok")
        })
    })
    
    socket.on('upload_note', (data) => {
        console.log(data)
        note_data = [data.note_content, data.theme, data.time, data.author, data.title]
        connection.query('UPDATE `note` SET note_content = ? WHERE theme = ? && time=? && author =?&& title=? ', note_data, function (error, ras) {
            if (error) {
                console.log('更新資料失敗');
            } else console.log("ok")
        })
    })

    socket.on('delete_q', (data) => {
        console.log(data)
        delete_q=[data.question_title, data.theme,  data.UID, data.question_data]
        connection.query('DELETE FROM `ask` WHERE question_title = ? && theme=? && UID=? && question_data=?',delete_q, function (error, ras) {
            if (error) {
                console.log('刪除資料失敗');
            } else console.log("ok")
        })
    })
    
    socket.on('delete_note', (data) => {
        console.log(data)
        delete_note=[data.note_content,data.theme,data.author,data.title]
        connection.query('DELETE FROM `note` WHERE note_content = ? && theme=? && author=? && title=?',delete_note, function (error, ras) {
            if (error) {
                console.log('刪除資料失敗');
            } else console.log("ok")
        })
    })

    socket.on('answer', (data) => {
        token = jwt.verify(data, 'eric21364')
        ask = {
            theme: [],
            question_title: [],
            grade: [],
            key_word: [],
            money: [],
            question_data: [],
            UID: [],
            time: []
        }
        connection.query('SELECT * FROM `ask` ', function (error, ras) {
            if (error) {
                console.log('抓取帳號資料失敗');
            }
            for (var i = 0; i < ras.length; i++) {

                ask.theme.push(ras[i].theme);
                ask.question_title.push(ras[i].question_title);
                ask.grade.push(ras[i].grade);
                ask.key_word.push(ras[i].key_word);
                ask.money.push(ras[i].money);
                ask.question_data.push(ras[i].question_data);
                ask.UID.push(ras[i].UID);
                ask.time.push(ras[i].time);


            }
            socket.emit('answer', ask)
        })
    })

    socket.on('ask', (data) => {
        console.log(data)
        var date = new Date();
        token = jwt.verify(data.token, 'eric21364')
        ask = {
            theme: data.theme,
            question_title: data.title,
            grade: data.grade,
            key_word: data.key_word,
            money: data.money,
            question_data: data.question_data,
            UID: token.uid,
            time: date
        }
        connection.query('INSERT INTO `ask` SET ?', ask, function (error) {
            if (error) {
                console.log(error);
                console.log('寫入資料失敗！問題');
            }
        });
    })
    socket.on('new_note', (data) => {
        console.log(data)
        var date = new Date();
        token = jwt.verify(data.token, 'eric21364')
        note = {
            theme: data.theme,
            title: data.title,
            classify: data.classify,
            keyword: data.keyword,
            author: token.uid,
            note_content: data.data,
            UID: token.uid,
            time: date
        }
        connection.query('INSERT INTO `note` SET ?', note, function (error) {
            if (error) {
                console.log(error);
                console.log('寫入資料失敗！筆記');
            }
        });
    })
    socket.on('check', (data, callback) => {
            connection.query('SELECT * FROM `token` ', function (error, ras) {
                if (error) {
                    console.log('抓取帳號資料失敗');
                }
                for (var i = 0; i < ras.length; i++) {
                    if (data.token == ras[i].token) {
                        callback(ras[i].UID)
                    }
                }
            })
        }),
        socket.on('login', (data) => {
            connection.query('SELECT * FROM `account` ', function (error, ras) {
                if (error) {
                    console.log('抓取帳號資料失敗');
                }
                for (var i = 0; i < ras.length; i++) {

                    if (data.user_id == ras[i].email) {

                        if (data.user_pwd == ras[i].password) {
                            var token = jwt.sign({email: data.user_id,uid: ras[i].UID}, 'eric21364');
                            socket.emit('login', {
                                token: token,
                                status: 1,
                                UID: ras[i].UID
                            }) //1 登入成功
                            tea = {
                                account: data.user_id,
                                token: token,
                                UID: ras[i].UID
                            }
                            connection.query('INSERT INTO `token` SET ?', tea, function (error) {
                                if (error) {
                                    console.log(error);
                                    console.log('寫入資料失敗！帳號');
                                }

                            });
                        } else {
                            socket.emit('login', {
                                status: 0
                            }) //0登入失敗

                        }

                    } else {
                        socket.emit('login', {
                            status: 2
                        }) //2沒有註冊過的email

                    }
                }
            })
        })
    socket.on('email_insp', (data) => {
        connection.query('SELECT * FROM `account` ', function (error, ras) {
            if (error) {
                console.log('抓取帳號資料失敗');
            }
            al = ras.length;
            if (ras.length == 0) {
                socket.emit('email_insp', "信箱可以使用");
            } else {
                for (var i = 0; i < ras.length; i++) {
                    if (data == ras[i].email) {
                        socket.emit('email_insp', "信箱重複");
                        console.log("信箱重複")
                        return;
                    }
                }
                socket.emit('email_insp', "信箱可以使用");
            }
        });
        console.log(data)

    })
    socket.on('name_insp', (data) => {
        connection.query('SELECT * FROM `person_inform` ', function (error, ras) {
            if (error) {
                console.log('抓取資訊資料失敗');
            }
            if (ras.length == 0) {
                socket.emit('name_insp', "暱稱可以使用");
            } else {
                for (var i = 0; i < ras.length; i++) {
                    if (data == ras[i].nickname) {
                        socket.emit('name_insp', "暱稱重複");
                        console.log("暱稱重複")
                        return
                    }
                }
                socket.emit('name_insp', "暱稱可以使用");
                console.log("asd")
            }
        })
    });
    socket.on('register', (data) => {
        var date = new Date();
        let dl = {
            email: data.email,
            password: data.pwd,
            UID: al

        };
        let acc = {
            create_data: date,
            user_biry: data.birth,
            nickname: data.name,
            self_introd: data.introduce,
            phone: data.mobile,
            school: data.school,
            grade: data.grade,
            UID: dl.UID
        };
        connection.query('INSERT INTO `account` SET ?', dl, function (error) {
            if (error) {
                console.log(error);
                console.log('寫入資料失敗！帳號');
            }
        });
        connection.query('INSERT INTO `person_inform` SET ?', acc, function (error) {
            if (error) {
                console.log(error);
                console.log('寫入資料失敗！資訊');
            }
        });
    });
});
app.post('/', function (req, res) {
    var max_a = 0;
    connection.query('SELECT * FROM `graph` ', function (error, ras) {
        if (error) {
            console.log('抓取圖形資料失敗');
        }
        for (var i = 0; i < ras.length; i++) {
            grapa.x0.push(ras[i].x0);
            grapa.y0.push(ras[i].y0);
            grapa.x1.push(ras[i].x1);
            grapa.y1.push(ras[i].y1);
            grapa.color.push(ras[i].color);
            grapa.lw.push(ras[i].lw);
            grapa.con.push(ras[i].con);
            grapa.grap.push(ras[i].grap);
            grapa.time.push(ras[i].time);
            grapa.a.push(ras[i].id);
            console.log("grapa.a : " + ras[i].id);
            if (max_a < ras[i].id) {
                max_a = ras[i].id;
            }
            a = max_a;
        }
    });



    connection.query('SELECT * FROM `draw` ', function (error, rs) {
        if (error) {
            console.log('抓取畫筆資料失敗');
        }
        for (var i = 0; i < rs.length; i++) {
            test.x0.push(rs[i].x0);
            test.y0.push(rs[i].y0);
            test.x1.push(rs[i].x1);
            test.y1.push(rs[i].y1);
            test.color.push(rs[i].color);
            test.lc.push(rs[i].lc);
            test.c.push(rs[i].c);
            test.ear.push(rs[i].ear);
            test.time.push(rs[i].time);
            test.a.push(rs[i].id);
            //console.log("test.a : "+ rs[i].id);
            if (max_a < rs[i].id) {
                max_a = rs[i].id;
            }
            a1 = max_a;
        }
    });
    var a = Math.max(a, a1)
    if (a = '') {
        a = 0
    }
    var obj = {
        test: test,
        grapa: grapa
    };

    console.log("post");
    res.send(obj);

    test = {
        x0: [], //起點X
        y0: [], //起點Y
        x1: [], //終點X
        y1: [], //終點Y
        color: [], //顏色
        lc: [],
        c: [], //筆寬
        ear: [], //橡皮擦
        time: [], //時間
        a: [] //順序    
    };
    grapa = {
        x0: [], //起點X
        y0: [], //起點Y
        x1: [], //終點X
        y1: [], //終點Y
        color: [], //顏色
        lw: [], //邊寬粗細
        con: [], //是否空心
        grap: [], //圓或方
        time: [], //時間
        a: [] //順序
    };

});

function onConnection(socket) {

    socket.on('drawing', (data) => {

        socket.broadcast.emit('drawing', data)

        a++;
        var dl = {
            x0: data.x0,
            y0: data.y0,
            x1: data.x1,
            y1: data.y1,
            c: data.lw,
            lc: data.lc,
            color: data.color,
            ear: data.ear,
            time: data.time,
            id: a
        };
        connection.query('INSERT INTO `draw` SET ?', dl, function (error) {
            if (error) {
                console.log(error);
                console.log('寫入資料失敗！3');
            }
        });

    });


    socket.on('dd', (data) => {
        socket.broadcast.emit('dd', data);

        var im = {
            base64: data
        };
        connection.query('INSERT INTO `image` SET ?', im, function (error) {
            if (error) {
                console.log('寫入資料失敗！4');
            }
        });
    });
    socket.on('dd2', (data) => {
        socket.broadcast.emit('dd2', data);
    });
    socket.on('c', (data) => {
        socket.broadcast.emit('c', data);

        var sa = {
            lw: data
        };
        connection.query('INSERT INTO `c` SET ?', sa, function (error) {
            if (error) {
                console.log('寫入資料失敗！5');
            }
        });
    });

    socket.on('image', (data) => {
        socket.broadcast.emit('image', data)

    });
    socket.on('ga', (data) => {
        socket.broadcast.emit('ga', data)
        a++;
        var ci = {
            x0: data.x0, //起點X
            y0: data.y0, //起點Y
            x1: data.x1, //終點X
            y1: data.y1, //終點Y
            color: data.color, //顏色
            lw: data.lw, //邊寬粗細
            con: data.con, //是否空心
            grap: data.cr, //圓或方
            time: data.date, //時間
            id: a //順序
        };

        connection.query('INSERT INTO `graph` SET ?', ci, function (error) {
            if (error) {
                console.log('寫入資料失敗！6');
            }
            console.log("draw graph in");
        });
    });


    socket.on('lin', (data) => {
        socket.broadcast.emit('lin', data)

        var lin = {
            x0: data.x0,
            y0: data.y0,
            x1: data.x1,
            y1: data.y1,
            color: data.color,
            date: data.date,
            lw: data.lw,
            a: a
        };

        connection.query('INSERT INTO `lin` SET ?', lin, function (error) {
            if (error) {
                console.log('寫入資料失敗！7');
            }
        });
        a++;
    });

    socket.on('cle', (data) => {
        socket.broadcast.emit('cle', data)
    });
    socket.on('canvasz', (data) => {
        socket.broadcast.emit('canvasz', data)
    });
}




io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
