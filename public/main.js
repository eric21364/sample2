//白板\
var socket = io.connect();
var canvas = document.getElementsByClassName('whiteboard')[0];
var colors = document.getElementsByClassName('color');
var context = canvas.getContext('2d');
var current = {
    color: 'black'
};
var xx;
//var canvasOffset = $("#canvas").offset();
//var offsetX = canvasOffset.left;
//var offsetY = canvasOffset.top;
var startX;
var startY;
var isDown = false;
var pi2 = Math.PI * 2;
var resizerRadius = 8;
var rr = resizerRadius * resizerRadius;
var draggingResizer = {
    x: 0,
    y: 0
};
var imageX = 10,
    imageY = 10;
var imageWidth = 0,
    imageHeight = 0,
    imageRight = 0,
    imageBottom = 0;
var draggingImage = false;
var image = document.createElement("img");
var img = new Image();
var img1 = new Image();
var img2 = new Image();
var img3 = new Image();
var imageObj2 = new Image();
var linec = 2;
var q = false,
    m = false,
    rec = false,
    con = false,
    z = false,
    l = false,
    lc = false;
var cln = false;
var date = new Date();
var imageObj1 = new Image();
var cr;
var x0_list = "";
var y0_list = "";
var x1_list = "";
var y1_list = "";
var color_list = "";
var lc_list = "";
var linew_list = "";
var date_list = "";
var ear_list = "";
var tl = 0,
    tt = 0;
pen();
var line = {
    x0: [],
    y0: [],
    x1: [],
    y1: [],
    color: [],
    linew: [],
    lc: [],
    date: [],
    ear: [],
    a: []
}
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

}

var data = {
    test: line,
    grapa: grapa
};
data.title = "title";
data.message = "message"
$.ajax({
    url: "/",
    type: "POST",
    dataType: 'html',
    success: function (data) {
        var line = 0;
        var j = 0;
        var z = 0;
        var max_num, min_num;
        var w = canvas.width;
        var h = canvas.height;
        line = JSON.parse(data);
        //var grapa = JSON.parse(data.grapa);
        if (Math.max.apply(null, line.test.a) > Math.max.apply(null, line.grapa.a)) {
            max_num = Math.max.apply(null, line.test.a);
        } else {
            max_num = Math.max.apply(null, line.grapa.a)
        }
        if (Math.min.apply(null, line.test.a) < Math.min.apply(null, line.grapa.a)) {
            min_num = Math.min.apply(null, line.test.a);
        } else {
            min_num = Math.min.apply(null, line.grapa.a)
        }
        for (var i = min_num; i <= max_num; i++) {
            for (var j = 0; j <= Math.max.apply(null, line.test.a); j++) {
                if (line.test.a[j] == i) {
                    line.x0 = line.test.x0[i].split(",");
                    line.y0 = line.test.y0[i].split(",");
                    line.x1 = line.test.x1[i].split(",");
                    line.y1 = line.test.y1[i].split(",");

                    for (var z = 0; z < line.x0.length; z++) {
                        drawLine(line.x0[z] * w, line.y0[z] * h, line.x1[z] * w, line.y1[z] * h, line.test.color[j], !line.test.lc[j], line.test.c[j], line.test.time[j], !line.test.ear[j], false, false);
                    }
                }
            }
            for (var j = 0; j <= line.grapa.a.length; j++) {
                if (line.grapa.a[j] == i) {
                    graa(line.grapa.x0[j] * w, line.grapa.y0[j] * h, line.grapa.x1[j] * w, line.grapa.y1[j] * h, line.grapa.color[j], line.grapa.time[j], line.grapa.lw[j], Boolean(line.grapa.con[j]), line.grapa.grap[j], false);

                }
            }
        }

    },
    error: function (xhr, ajaxOptions, thrownError) {
        alert("error  " + xhr.status);
        alert(thrownError);

    }

})

$("#source").css("display", "none");

for (var i = 0; i < colors.length; i++) {
    colors[i].addEventListener('click', onColorUpdate, false);
}
socket.on('dd2', onDrawingimage2);
socket.on('cle', onDrawingcln);
socket.on('ga', onDrawingcir);
socket.on('drawing', onDrawingEvent);
socket.on('dd', onPPPPEvent);
socket.on('lin', function (data) {
    var w = canvas.width;
    var h = canvas.height;
    liia(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.date, data.lw)
})
socket.on('c', function (data) {
    context.lineWidth = data;
});
socket.on('image', function (data) {
    var w = canvas.width;
    var h = canvas.height;
    darthVaderImg.width(Math.abs(data.imageWidth) * w);
    darthVaderImg.height(Math.abs(data.imageHeight) * h);
    darthVaderGroup.x(data.imageX * w);
    darthVaderGroup.y(data.imageY * h);
    darthVaderImg.image(imageObj1);
    update(this);
    layer.draw();
    console.log(data);
});

window.addEventListener('resize', onResize, false);

onResize();
onResize2();
onResize3();
onResize4();
onResize5();
onResize6();
context.lineWidth = 2; //預設比寬=2

function drawLine(x0, y0, x1, y1, color, lc, c, date, ear, emit, send) { //畫線

    var w = canvas.width;
    var h = canvas.height;

    context.beginPath(); //重製路徑
    context.lineWidth = c;
    if (ear == false) {
        if (lc == true) {
            context.lineCap = "round";
            context.lineJoin = "round";
        }
        if (lc == false) {
            context.lineCap = "butt";
            context.lineJoin = "round";
        }
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = color; //畫筆顏色
        context.stroke();
        context.closePath();
    }
    if (ear == true) {
        context.globalCompositeOperation = "destination-out";
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = 'white'; //畫筆顏色
        context.stroke();
        context.closePath();
        context.globalCompositeOperation = "source-over";

    }
    if (!emit) {
        if (!send) {
            return;
        } else {
            x0_list = x0_list + String(x0 / w) + ',';
            y0_list = y0_list + String(y0 / h) + ',';
            x1_list = x1_list + String(x1 / w) + ',';
            y1_list = y1_list + String(y1 / h) + ',';
            color_list = color_list + String(color) + ',';
            lc_list = lc_list + String(lc) + ','
            linew_list = linew_list + String(c) + ',';
            date_list = date_list + String(date) + ',';
            ear_list = ear_list + String(ear) + ',';
            //console.log(x_list);
            return;
        }
    } else {
        x0_list = x0_list.slice(0, -1);
        x1_list = x1_list.slice(0, -1);
        y1_list = y1_list.slice(0, -1);
        y0_list = y0_list.slice(0, -1);
        color_list = color_list.slice(0, -1);
        lc_list = lc_list.slice(0, -1);
        linew_list = linew_list.slice(0, -1);
        date_list = date_list.slice(0, -1);
        ear_list = ear_list.slice(0, -1);

        if (x0_list == 0) {
            return;
        }

        socket.emit('drawing', {
            x0: x0_list,
            y0: y0_list,
            x1: x1_list,
            y1: y1_list,
            color: color_list,
            lc: lc_list,
            lw: linew_list,
            time: date_list,
            ear: ear_list
        });

        x0_list = "";
        y0_list = "";
        x1_list = "";
        y1_list = "";
        color_list = "";
        lc_list = "";
        linew_list = "";
        date_list = "";
        ear_list = "";
    }
}

function linewidth(c) //調整畫筆粗細
{
    context.lineWidth = c;
    linec = c;
    socket.emit('c', context.lineWidth);
    $("#linewidth").css("font-size", c);
}

function pena() {
    z = false;
    pen();
}

function earr() {
    z = true;
    pen();
}

function pen() { //畫筆
    var rect =canvas.getBoundingClientRect();
    $("#canvas1").hide();
    $("#canvas2").hide();
    $("#as").css("z-index","-1");
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 5), false);
    canvas.addEventListener('touchstart', touchDown);
    canvas.addEventListener('touchup', touchUp, false);
    canvas.addEventListener('touchend', touchUp, false);
    canvas.addEventListener('touchmove', throttle(touchMove, 10), false);

    function onMouseDown(e) {
        q = true;
        date = new Date();
        current.x =  (e.pageX - rect.left) * (canvas.width / rect.width);
        current.y = (e.pageY - rect.top) * (canvas.height / rect.height);
        console.log("X:",e.clientX);
        console.log("Y:",e.clientX);
        
    }

    function onMouseUp(e) {

        q = false;
        date = new Date();
        drawLine((e.pageX - rect.left) * (canvas.width / rect.width), (e.pageY - rect.top) * (canvas.height / rect.height), (e.pageX - rect.left) * (canvas.width / rect.width), (e.pageY - rect.top) * (canvas.height / rect.height), current.color, lc, linec, date, z, true, true);
    }

    function onMouseMove(e) {
        if (!q) {
            return;
        }
        date = new Date();
        drawLine(current.x, current.y, (e.pageX - rect.left) * (canvas.width / rect.width), (e.pageY - rect.top) * (canvas.height / rect.height), current.color, lc, linec, date, z, false, true);
        current.x = (e.pageX - rect.left) * (canvas.width / rect.width);
        current.y = (e.pageY - rect.top) * (canvas.height / rect.height);
    }

    function touchDown(e) {
        q = true;
        this.touch = e.targetTouches[0];
        date = new Date();
        current.x = this.touch.screenX;
        current.y = this.touch.screenY;
    }

    function touchUp(e) {
        q = false;
        date = new Date();
        context.closePath();
    }

    function touchMove(e) {
        if (!q) {
            return;
        }
        this.touch = e.targetTouches[0];
        date = new Date();
        if (e.targetTouches.length == 1) {
            drawLine(current.x, current.y, this.touch.screenX, this.touch.screenY, current.color, lc, context.lineWidth, date, z, true, true);
            current.x = this.touch.screenX;
            current.y = this.touch.screenY;
            e.preventDefault();
        }
    }
}

function onColorUpdate(e) {
    $("#whiteboard").show(); //顯示       
    current.color = e.target.className.split(' ')[1];
}

function updataimage(ix, iy, iw, ih) {
    var w = canvas.width;
    var h = canvas.height;
    socket.emit('image', {
        imageX: ix / w,
        imageY: iy / h,
        imageWidth: iw / w,
        imageHeight: ih / h
    });
}

//limit the number of events per second
function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function () {
        var time = new Date().getTime();
        if ((time - previousCall) >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
        }
    };
}

function onDrawingcln(data) //清空
{
    cln = data;
    clean();
}

function onDrawingEvent(data) //畫筆
{
    var w = canvas.width;
    var h = canvas.height;
    line.x0 = data.x0.split(",");
    line.y0 = data.y0.split(",");
    line.x1 = data.x1.split(",");
    line.y1 = data.y1.split(",");
    line.color = data.color.split(",");
    line.linew = data.lw.split(",");
    line.lc = data.lc.split(",");
    line.date = data.time.split(",");
    line.ear = data.ear.split(",");
    for (i = 0; i < line.x0.length; i++) {
        drawLine(Number(line.x0[i]) * w, Number(line.y0[i]) * h, Number(line.x1[i]) * w, Number(line.y1[i]) * h, line.color[i], !line.lc[i], line.linew[i], date, !line.ear[i], false, false);
    }
}

function onDrawingcir(data) //圓
{
    var w = canvas.width;
    var h = canvas.height;
    graa(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.date, data.lw, data.con, data.cr, false);
}

function onPPPPEvent(data) //圖片
{
    image = new Image();
    image.onload = function () {
        imageWidth = image.width;
        imageHeight = image.height;
        imageRight = imageX + imageWidth;
        imageBottom = imageY + imageHeight;
        xx = data;
        darthVaderImg.image(imageObj1);
        layer.draw();
    };
    image.src = data;
    img.src = data;
    imageObj1.src = data;
}

function onDrawingimage2(data) //圖片2
{
    image = new Image();
    image.onload = function () {
        imageWidth = image.width;
        imageHeight = image.height;
        imageRight = imageX + imageWidth;
        imageBottom = imageY + imageHeight;
        xx = data;
        yodaImg.image(image);
        layer.draw();
    };
    image.src = data;
    imageObj2.src = data;
}

// make the canvas fill its parent
function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function onResize2() {
    var canvas = document.getElementById("canvas")
    var ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

function onResize3() {
    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function onResize4() {
    var canvas = document.getElementById("canvas2");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function onResize5() {
    var canvas = document.getElementById("whiteboard2");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    $("#whiteboard2").hide();
}

function onResize6() {
    var canvas = document.getElementById("whiteboard3");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    $("#whiteboard3").hide();
}

$("#uploadImage").change(function () { //按鈕 上傳圖片
    readImage(this);
});

function readImage(input) {
    if (input.files && input.files[0]) {
        var FR = new FileReader();
        FR.onload = function (e) {
            //e.target.result = base64 format picture
            //$('#imageObj2').attr( "src", e.target.result );
            imageObj2.src = e.target.result;
            socket.emit('dd2', e.target.result);
        };
        FR.readAsDataURL(input.files[0]);
        var canvas = document.getElementById('canvas')
        var ctx = document.getElementById('canvas').getContext("2d");
        ctx.drawImage(imageObj2, 0, 0);
    }
}

function conc() { //按鈕 一般圓
    m = true;
    cr = true;
    con = true;
    q = false;
    graph();
}

function circ() { //按鈕 空心圓
    m = true;
    q = false;
    cr = true;
    con = false;
    graph();
}

function recc() { //按鈕 一般矩形
    rec = true;
    q = false;
    cr = false;
    con = false;
    graph();
}

function conrr() { //按鈕 空心矩形
    rec = true;
    q = false;
    cr = false;
    con = true;
    graph();
}

function graph() { //畫圓
    date = new Date();
    $("#as").show();
    $("#canvas1").show();
    $("#canvas1").css("z-index", "10");
    $("#canvas2").hide();
    $("#canvas2").css("z-index", "1");
    var canvas = document.getElementById("canvas1");
    // 建立繪製物件
    var context = canvas.getContext("2d");
    var r = 1;
    var s, y;
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
    
     var rect =canvas.getBoundingClientRect();
    function onMouseDown(e) {
        m = true;
        rec = true;
        date = new Date();
        s = (e.pageX - rect.left) * (canvas.width / rect.width);
        y = (e.pageY - rect.top) * (canvas.height / rect.height);
    }

    function onMouseUp(e) {
        if (!m && !rec) {
            return;
        }
        m = false;
        rec = false;
        date = new Date();
        graa(s, y, (e.pageX - rect.left) * (canvas.width / rect.width), (e.pageY - rect.top) * (canvas.height / rect.height), current.color, date, linec, con, cr, true);
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function onMouseMove(e) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        date = new Date();
        if (!m && !rec) {
            return;
        }
        gcr(s, y, (e.pageX - rect.left) * (canvas.width / rect.width), (e.pageY - rect.top) * (canvas.height / rect.height), current.color, date, linec, con, cr, false);
    }


    function gcr(x0, y0, x1, y1, color, date, linec, con, cr, l) { //畫線
        context.beginPath(); //重製路徑
        context.lineWidth = linec;
        if (cr == true) {
            if (con == false) {
                context.fillStyle = color;
                r = distance(x0, y0, x1, y1);
                context.arc(x1, y1, r, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
            }
            if (con == true) {
                context.fillStyle = "";
                context.strokeStyle = color;
                context.strokeWidth = 2;
                r = distance(x0, y0, x1, y1);
                context.arc(x1, y1, r, 0, Math.PI * 2, true);
                // 繪製圓形 參數依序為 x、y、半徑r、起始角度、結束角度、順時針繪製     
                context.closePath();
                //context.fill();  
                context.stroke();
            }
        }

        if (cr == false) {
            if (con == false) {
                context.moveTo(x0, y0);
                context.fillStyle = color; //畫筆顏色
                context.rect(x0, y0, x1 - x0, y1 - y0);
                context.closePath();
                context.fill();
            } else if (con == true) {
                context.strokeStyle = color;
                context.strokeWidth = 2;
                context.rect(x0, y0, x1 - x0, y1 - y0);
                context.closePath();
                context.stroke();
            }
        }
    }
}


function graa(x0, y0, x1, y1, color, date, c, con, cr, l) {
    var r = 1;
    var s, y;
    var w = canvas.width;
    var h = canvas.height;
    context.lineWidth = c;
    context.beginPath(); //重製路徑
    if (cr == true) {
        if (con == false) {
            context.strokeWidth = 1;
            context.fillStyle = color;
            r = distance(x0, y0, x1, y1);
            context.arc(x1, y1, r, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        }
        if (con == true) {
            context.fillStyle = "";
            context.strokeStyle = color;
            context.strokeWidth = 2;
            r = distance(x0, y0, x1, y1);
            context.arc(x1, y1, r, 0, Math.PI * 2, true);
            // 繪製圓形 參數依序為 x、y、半徑r、起始角度、結束角度、順時針繪製    
            context.closePath();
            //context.fill();
            context.stroke();
        }
    }

    if (cr == false) {
        if (con == false) {
            context.strokeWidth = 1;
            context.moveTo(x0, y0);
            context.fillStyle = color; //畫筆顏色
            context.rect(x0, y0, x1 - x0, y1 - y0);
            context.closePath();
            context.fill();
        } else if (con == true) {
            context.strokeStyle = color;
            context.strokeWidth = 2;
            context.rect(x0, y0, x1 - x0, y1 - y0);
            context.closePath();
            context.stroke();
        }
    }
    if (l == false) {
        return;
    } else {
        socket.emit('ga', {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color: color,
            lw: c,
            con: con,
            cr: cr,
            date: date
        });
    }
}

function distance(ax, ay, bx, by) { //圓的半徑
    var dx = bx - ax;
    var dy = by - ay;
    return Math.sqrt(dx * dx + dy * dy);
}

function saveimage() { //儲存圖片
    var dataURL = canvas.toDataURL();
    document.getElementById("saveimage").scr = dataURL;
}

function cle() {
    cln = true;
    socket.emit('cle', cln);
    clean();
}

function clean() {
    if (cln == true) {
        context.clearRect(0, 0, width, height);
    }
    cln = false;
}

//貼圖 

var CLIPBOARD = new CLIPBOARD_CLASS("canvas", true);
var dd = false;

function CLIPBOARD_CLASS(canvas_id, autoresize) {
    var _self = this;
    var canvas = document.getElementById(canvas_id);
    var ctx = document.getElementById(canvas_id).getContext("2d");

    //handlers
    document.addEventListener('paste', function (e) {
        _self.paste_auto(e);
    }, false);

    //on paste
    this.paste_auto = function (e) {
        if (e.clipboardData) {
            var items = e.clipboardData.items;
            if (!items) return;

            //access data directly
            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    //image
                    var blob = items[i].getAsFile();
                    var URLObj = window.URL || window.webkitURL;
                    var source = URLObj.createObjectURL(blob);
                    this.paste_createImage(source);
                }
            }
            e.preventDefault();
        }
    };


    //draw pasted image to canvas
    this.paste_createImage = function (source) {
        var pastedImage = new Image();
        pastedImage.onload = function () {
            if (autoresize == true) { //判斷圖片大小
                //resize
                canvas.width = pastedImage.width;
                canvas.height = pastedImage.height;
            } else {
                //clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            ctx.drawImage(pastedImage, 0, 0); //畫
            xx = canvas.toDataURL();
            //ctx.drawImage(img1, 0, 0);
            socket.emit('dd', xx); //送base64資料到index.js
            imageWidth = canvas.width;
            imageHeight = canvas.height;
            imageRight = imageX + imageWidth;
            imageBottom = imageY + imageHeight;
            onResize2();
            ctx.drawImage(pastedImage, 0, 0); //畫

        };

        console.log("paste_createImage\n" + imageWidth);
        pastedImage.src = source;
        img.src = source;

        if (img.src != '') {
            img1.src = img.src;
            console.log("img1  " + img1);
            return CLIPBOARD = new CLIPBOARD_CLASS("canvas1", true);
        }
    };

}

function toBase64() {
    var c = document.getElementById("canvas");
    var dd = c.toDataURL();
    xx = dd;
    return dd;
}
//
//var width = window.innerWidth;
//var height = window.innerHeight;
//
//function update(activeAnchor) {
//    var group = activeAnchor.getParent();
//    var topLeft = group.get('.topLeft')[0];
//    var topRight = group.get('.topRight')[0];
//    var bottomRight = group.get('.bottomRight')[0];
//    var bottomLeft = group.get('.bottomLeft')[0];
//    var image = group.get('Image')[0];
//    var anchorX = activeAnchor.getX();
//    var anchorY = activeAnchor.getY();
//    // update anchor positions
//    switch (activeAnchor.getName()) {
//        case 'topLeft':
//            topRight.setY(anchorY);
//            bottomLeft.setX(anchorX);
//            break;
//        case 'topRight':
//            topLeft.setY(anchorY);
//            bottomRight.setX(anchorX);
//            break;
//        case 'bottomRight':
//            bottomLeft.setY(anchorY);
//            topRight.setX(anchorX);
//            break;
//        case 'bottomLeft':
//            bottomRight.setY(anchorY);
//            topLeft.setX(anchorX);
//            break;
//    }
//    image.position(topLeft.position());
//    var width = topRight.getX() - topLeft.getX();
//    var height = bottomLeft.getY() - topLeft.getY();
//    if (width && height) {
//        image.width(width);
//        image.height(height);
//    }
//
//}
//
//function addAnchor(group, x, y, name) {
//    var stage = group.getStage();
//    var layer = group.getLayer();
//    var anchor = new Konva.Circle({
//        x: x,
//        y: y,
//        stroke: '#666',
//        fill: '#ddd',
//        strokeWidth: 2,
//        radius: 8,
//        name: name,
//        draggable: true,
//        dragOnTop: false
//    });
//    anchor.on('dragmove', function () {
//        update(this);
//        layer.draw();
//    });
//    anchor.on('mousedown touchstart', function () {
//        group.setDraggable(false);
//        this.moveToTop();
//    });
//    anchor.on('dragend', function () {
//        group.setDraggable(true);
//        layer.draw();
//    });
//    // add hover styling
//    anchor.on('mouseover', function () {
//        var layer = this.getLayer();
//        document.body.style.cursor = 'pointer';
//        this.setStrokeWidth(4);
//        layer.draw();
//    });
//    anchor.on('mouseout', function () {
//        var layer = this.getLayer();
//        document.body.style.cursor = 'default';
//        this.setStrokeWidth(2);
//        layer.draw();
//    });
//    group.add(anchor);
//}
//
//var stage = new Konva.Stage({
//    container: 'as',
//    width: width,
//    height: height
//});
//var layer = new Konva.Layer();
//stage.add(layer);
//// darth vader
//var darthVaderImg = new Konva.Image({
//    width: imageWidth,
//    height: imageHeight
//});
//// yoda
//var yodaImg = new Konva.Image({
//    width: 93,
//    height: 104
//});
//var darthVaderGroup = new Konva.Group({
//    x: imageX,
//    y: imageY,
//    draggable: true
//});
//
//darthVaderGroup.on("dragstart", function () {
//    this.moveToTop();
//    layer.draw();
//});
//darthVaderGroup.on("dragend", function () {
//    console.log("do out");
//    updataimage(darthVaderGroup.x(), darthVaderGroup.y(), darthVaderImg.width(), darthVaderImg.height());
//});
//
//darthVaderGroup.on("dblclick dbltap", function () {
//    this.destroy();
//    layer.draw();
//
//
//});
//var yodaGroup = new Konva.Group({
//    x: imageX,
//    y: imageY,
//    draggable: true
//});
//
//yodaGroup.on("dragstart", function () {
//    this.moveToTop();
//    layer.draw();
//    console.log("x  " + layer.getHeight(imageObj1));
//});
//
//yodaGroup.on("dblclick dbltap", function () {
//    this.destroy();
//    layer.draw();
//});
//layer.add(darthVaderGroup);
//darthVaderGroup.add(darthVaderImg);
//addAnchor(darthVaderGroup, darthVaderGroup.x(), darthVaderGroup.y(), 'topLeft');
//addAnchor(darthVaderGroup, Number(darthVaderImg.width()), darthVaderGroup.y(), 'topRight');
//addAnchor(darthVaderGroup, darthVaderImg.width(), darthVaderImg.height(), 'bottomRight');
//addAnchor(darthVaderGroup, darthVaderGroup.x(), darthVaderImg.height(), 'bottomLeft');
//
//layer.add(yodaGroup);
//yodaGroup.add(yodaImg);
//addAnchor(yodaGroup, 0, 0, 'topLeft');
//addAnchor(yodaGroup, 93, 0, 'topRight');
//addAnchor(yodaGroup, 93, 104, 'bottomRight');
//addAnchor(yodaGroup, 0, 104, 'bottomLeft');
//
//function move() { //移動圖片
//    $("#whiteboard").hide(); //隱藏白板
//    $("#canvas1").hide();
//    $("#canvas2").hide();
//    $("#as").show();
//    imageObj1.onload = function () {
//        darthVaderImg.image(imageObj1);
//        layer.draw();
//    };
//    imageObj1.src = img.src;
//    imageObj2.onload = function () {
//        yodaImg.image(imageObj2);
//        layer.draw();
//    };
//}


function grrrr(a) {
    $("#source").css("display", "none");
    $("#source").css("z-index", "1");
    context.font = "20pt Arial";
    context.fillText($('#source').text(), tl, tt);
    if (i % 3 == 0) {
        $("#whiteboard").show();
        $("#whiteboard").css("z-index", "1");
    } else if (i % 3 == 1) {
        $("#whiteboard2").show();
        $("#whiteboard2").css("z-index", "1");
    } else if (i % 3 == 2) {
        $("#whiteboard3").show();
        $("#whiteboard3").css("z-index", "1");
    }
    if (a == 1) {
        pena();
    }
    if (a == 2) {
        q = false;
        l = false;
        circ();
    }
    if (a == 3) {
        l = false;
        q = false;
        conc();
    }
    if (a == 4) {
        q = false;
        l = false;
        recc();
    }
    if (a == 5) {
        l = false;
        q = false;
        conrr();
    }
}

function drawllll(a) {
    $("#source").css("display", "none");
    $("#source").css("z-index", "1");
    context.font = "20pt Arial";
    context.fillText($('#source').text(), tl, tt);
    if (i % 3 == 0) {
        $("#whiteboard").show();
        $("#whiteboard").css("z-index", "10");
        console.log("jfdioas")
    } else if (i % 3 == 1) {
        $("#whiteboard2").show();
        $("#whiteboard2").css("z-index", "10");
    } else if (i % 3 == 2) {
        $("#whiteboard3").show();
        $("#whiteboard3").css("z-index", "10");
    }
    $("#canvas1").hide()
    $("#cabvas2").hide()
    if (a == 2) {
        l = false;
        m = false;
        cr = false;
        con = false;
        lc = false;
        pena();
        console.log("djiodjf")
    }
    if (a == 3) {
        l = false;
        m = false;
        cr = false;
        con = false;
        lc = true;
        pena();
    }
    if (a == 4) {
        l = false;
        m = false;
        cr = false;
        con = false;
        earr();
    }
    if (a == 5) {
        m = false;
        cr = false;
        con = false;
        q = false;
        l = true;
        lined();
    }

}

function lined() { //畫線
    date = new Date();
    if (i % 3 == 0) {
        $("#whiteboard").show;
        $("#whiteboard").css("z-index", "1");
    } else if (i % 3 == 1) {
        $("#whiteboard2").show;
        $("#whiteboard2").css("z-index", "1");
    } else if (i % 3 == 2) {
        $("#whiteboard3").show;
        $("#whiteboard3").css("z-index", "1");
    }
    $("#canvas2").show;
    $("#canvas2").css("z-index", "10");
    var canvas = document.getElementById("canvas2");
    // 建立繪製物件
    var s, y;
    var context = canvas.getContext("2d");
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
    canvas.addEventListener('touchstart', touchDown);
    canvas.addEventListener('touchup', touchUp, false);
    canvas.addEventListener('touchend', touchUp, false);
    canvas.addEventListener('touchmove', throttle(touchMove, 0), false);

    function onMouseDown(e) {
        l = true;
        date = new Date();
        s = (e.pageX - rect.left) * (canvas.width / rect.width);
        y = (e.pageX - rect.left) * (canvas.width / rect.width);
    }

    function onMouseUp(e) {
        if (!l) {
            return;
        }
        l = false;
        date = new Date();
        liia(s, y, (e.pageX - rect.left) * (canvas.width / rect.width), (e.pageX - rect.left) * (canvas.width / rect.width), current.color, date, linec, true);
        context.clearRect(0, 0, width, height);
    }

    function onMouseMove(e) {
        if (!l) {
            return;
        }
        context.clearRect(0, 0, width, height);
        date = new Date();
        lii(s, y, (e.pageX - rect.left) * (canvas.width / rect.width), (e.pageX - rect.left) * (canvas.width / rect.width), current.color, date, linec, true);
    }

    function touchDown(e) {
        q = true;
        this.touch = e.targetTouches[0];
        date = new Date();
        s = this.touch.screenX;
        y = this.touch.screenY;
    }

    function touchUp(e) {
        if (!l) {
            return;
        }
        q = false;
        date = new Date();
        liia(s, y, current.x, current.y, current.color, date, linec, true);
        context.clearRect(0, 0, width, height);
    }

    function touchMove(e) {
        context.clearRect(0, 0, width, height);
        if (!l) {
            return;
        }
        this.touch = e.targetTouches[0];
        date = new Date();
        if (e.targetTouches.length == 1) {
            lii(s, y, this.touch.screenX, this.touch.screenY, current.color, date, linec, true);
            current.x = this.touch.screenX;
            current.y = this.touch.screenY;
            e.preventDefault();
        }
    }

    function lii(x0, y0, x1, y1, color, date, lw, l) { //畫線
        context.beginPath(); //重製路徑
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = color; //畫筆顏色
        context.stroke();
    }
}

function liia(x0, y0, x1, y1, color, date, lw, l) { //畫線
    context.globalCompositeOperation = "source-over";
    context.lineWidth = lw;
    context.beginPath(); //重製路徑
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color; //畫筆顏色
    context.stroke();
    context.closePath;
    var w = canvas.width;
    var h = canvas.height;

    if (!l) {
        return;
    }
    socket.emit('lin', {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: color,
        lw: lw,
        date: date
    });
}

document.ondragover = function (evt) {
    //取消事件的預設
    return false;
}

function text() {
    $("#source").css("display", "block");
    $("#source").css("z-index", "6");
}
document.ondrop = function (evt) {
    source.style.position = "absolute";
    source.style.left = evt.screenX + "px";
    source.style.top = evt. screenY + "px";
    tl = evt.screenX;
    tt = evt.screenY;
    $("#source").keypress(function (e) {
        code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            context.fillText($('#source').text(), tl, tt);
        }
    });
    return false;
}
//換顏色
$(".col li").click(function() {
    console.log( $(this).text())
    context.fillStyle = $(this).text();
    context.strokeStyle = $(this).text();
    current.color = $(this).text();
    
})
//換canvas
function cas() {
    i++;
    i = i % 3;
    casp(i);
    socket.emit('canvasz', i);
}

function casp(i) {

    if (i == 0) {
        canvas = $(".whiteboard")[0];
        context = canvas.getContext('2d');
        $("#whiteboard").show();
        $("#whiteboard").css("z-index", "10");
        $("#whiteboard2").hide();
        $("#whiteboard3").hide();
        $("#whiteboard2").css("z-index", "1");
        $("#whiteboard3").css("z-index", "1");
        pen();
    } else if (i == 1) {
        canvas = $(".whiteboard")[1];
        context = canvas.getContext('2d');
        $("#whiteboard").hide();
        $("#whiteboard2").show();
        $("#whiteboard3").hide();
        $("#whiteboard2").css("z-index", "10");
        $("#whiteboard").css("z-index", "1");
        $("#whiteboard3").css("z-index", "1");
        pen();
    } else if (i == 2) {
        canvas = $(".whiteboard")[2];
        context = canvas.getContext('2d');
        $("#whiteboard").hide();
        $("#whiteboard2").hide();
        $("#whiteboard3").show();
        $("#whiteboard3").css("z-index", "10");
        $("#whiteboard").css("z-index", "1");
        $("#whiteboard2").css("z-index", "1");
        pen();
    }
}
