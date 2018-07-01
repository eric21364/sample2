var width = window.innerWidth;
var height = window.innerHeight;

function update(activeAnchor) {
    var group = activeAnchor.getParent();
    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var image = group.get('Image')[0];
    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();
    // update anchor positions
    switch (activeAnchor.getName()) {
        case 'topLeft':
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            break;
        case 'topRight':
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            break;
        case 'bottomRight':
            bottomLeft.setY(anchorY);
            topRight.setX(anchorX);
            break;
        case 'bottomLeft':
            bottomRight.setY(anchorY);
            topLeft.setX(anchorX);
            break;
    }
    image.position(topLeft.position());
    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if (width && height) {
        image.width(width);
        image.height(height);
    }

}

function addAnchor(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();
    var anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 2,
        radius: 8,
        name: name,
        draggable: true,
        dragOnTop: false
    });
    anchor.on('dragmove', function () {
        update(this);
        layer.draw();
    });
    anchor.on('mousedown touchstart', function () {
        group.setDraggable(false);
        this.moveToTop();
    });
    anchor.on('dragend', function () {
        group.setDraggable(true);
        layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function () {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(4);
        layer.draw();
    });
    anchor.on('mouseout', function () {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.setStrokeWidth(2);
        layer.draw();
    });
    group.add(anchor);
}

var stage = new Konva.Stage({
    container: 'as',
    width: width,
    height: height
});
var layer = new Konva.Layer();
stage.add(layer);
// darth vader
var darthVaderImg = new Konva.Image({
    width: imageWidth,
    height: imageHeight
});
// yoda
var yodaImg = new Konva.Image({
    width: 93,
    height: 104
});
var darthVaderGroup = new Konva.Group({
    x: imageX,
    y: imageY,
    draggable: true
});

darthVaderGroup.on("dragstart", function () {
    this.moveToTop();
    layer.draw();
});
darthVaderGroup.on("dragend", function () {
    console.log("do out");
    updataimage(darthVaderGroup.x(), darthVaderGroup.y(), darthVaderImg.width(), darthVaderImg.height());
});

darthVaderGroup.on("dblclick dbltap", function () {
    this.destroy();
    layer.draw();


});
var yodaGroup = new Konva.Group({
    x: imageX,
    y: imageY,
    draggable: true
});

yodaGroup.on("dragstart", function () {
    this.moveToTop();
    layer.draw();
    console.log("x  " + layer.getHeight(imageObj1));
});

yodaGroup.on("dblclick dbltap", function () {
    this.destroy();
    layer.draw();
});
layer.add(darthVaderGroup);
darthVaderGroup.add(darthVaderImg);
addAnchor(darthVaderGroup, darthVaderGroup.x(), darthVaderGroup.y(), 'topLeft');
addAnchor(darthVaderGroup, Number(darthVaderImg.width()), darthVaderGroup.y(), 'topRight');
addAnchor(darthVaderGroup, darthVaderImg.width(), darthVaderImg.height(), 'bottomRight');
addAnchor(darthVaderGroup, darthVaderGroup.x(), darthVaderImg.height(), 'bottomLeft');

layer.add(yodaGroup);
yodaGroup.add(yodaImg);
addAnchor(yodaGroup, 0, 0, 'topLeft');
addAnchor(yodaGroup, 93, 0, 'topRight');
addAnchor(yodaGroup, 93, 104, 'bottomRight');
addAnchor(yodaGroup, 0, 104, 'bottomLeft');

function move() { //移動圖片
    onResize2();
    $("#whiteboard").hide(); //隱藏白板
    $("#canvas").hide();
    $("#canvas1").hide();
    $("#canvas2").hide;
    imageObj1.onload = function () {
        darthVaderImg.image(imageObj1);
        layer.draw();
    };
    imageObj1.src = img.src;
    imageObj2.onload = function () {
        yodaImg.image(imageObj2);
        layer.draw();
    };
}
