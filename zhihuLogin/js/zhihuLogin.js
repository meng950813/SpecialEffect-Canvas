//定义画布宽高和生成点的个数,最大半径
var WIDTH, HEIGHT, POINT, MaxRadius;;
var canvas = document.getElementById('Mycanvas');
var context = canvas.getContext('2d');
		context.strokeStyle = 'rgba(0,0,0,0.5)';
		context.strokeWidth = 1;

var circleArr = [];

var setSzie = function(){
	WIDTH = document.body.clientWidth || document.documentElement.clientWidth;
	HEIGHT = document.body.clientHeight || document.documentElement.clientHeight;
	WIDTH >= 720 ? (POINT = 40,MaxRadius = 15) : (POINT = 20, MaxRadius = 10);

	// 1： 保存canvas 图像内容
	var imgData = context.getImageData(0,0,WIDTH,HEIGHT);

	canvas.width = WIDTH,
	canvas.height = HEIGHT;
	// 2： 将保存图像重绘 ==> 防止canvas大小改变时, 页面无内容 --> 闪屏
  context.putImageData(imgData,0,0);
	
	context.fillStyle = 'rgba(0,0,0,0.3)';

}
setSzie();

window.onresize = setSzie;

//线条：开始xy坐标，结束xy坐标，线条透明度
function Line (x, y, _x, _y, o) {
	this.beginX = x,
	this.beginY = y,
	this.closeX = _x,
	this.closeY = _y,
	this.o = o;
}

//点：圆心xy坐标，半径，每帧移动xy的距离
function Circle (x, y, r, moveX, moveY) {
	this.x = x,
	this.y = y,
	this.r = r,
	this.moveX = moveX,
	this.moveY = moveY;
}

//生成max和min之间的随机数
function randomNum (max, _min) {
	var min = arguments[1] || 0;
	return Math.floor(Math.random()*(max-min+1)+min);
}
// 绘制原点
function drawCricle (cxt, x, y, r, moveX, moveY) {
	var circle = new Circle(x, y, r, moveX, moveY)
	cxt.beginPath()
	cxt.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI)
	cxt.closePath()
	cxt.fill();
	return circle;
}

//绘制线条
function drawLine (cxt, x, y, _x, _y, o) {
	var line = new Line(x, y, _x, _y, o)
	cxt.beginPath()
	cxt.strokeStyle = 'rgba(0,0,0,'+ o +')'
	cxt.moveTo(line.beginX, line.beginY)
	cxt.lineTo(line.closeX, line.closeY)
	cxt.closePath()
	cxt.stroke();

}

//初始化生成原点
function init () {
	circleArr = [];
	for (var i = 0; i < POINT; i++) {
		circleArr.push(drawCricle(context, randomNum(WIDTH), randomNum(HEIGHT), randomNum(MaxRadius, 2), randomNum(10, -10)/40, randomNum(10, -10)/40));
	}
	draw();
}

//每帧绘制
function draw () {
	context.clearRect(0,0,canvas.width, canvas.height);
	for (var i = 0; i < POINT; i++) {
		drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
	}
	for (var i = 0; i < POINT; i++) {
		for (var j = 0; j < POINT; j++) {
			if (i + j < POINT) {
				var A = Math.abs(circleArr[i+j].x - circleArr[i].x),
						B = Math.abs(circleArr[i+j].y - circleArr[i].y);
				// 获取两点间距
				var lineLength = Math.sqrt(A*A + B*B);
				
				// 根据距离计算及判断两点是否要有连线
				var C = 1/lineLength*7-0.009;
				var lineOpacity = C > 0.3 ? 0.3 : C;
				if (lineOpacity > 0) {
					drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i+j].x, circleArr[i+j].y, lineOpacity);
				}
			}
		}
	}
}

function move(){
	for (var i = 0; i < POINT; i++) {
		var cir = circleArr[i];
		cir.x += cir.moveX;
		cir.y += cir.moveY;

		// 防止生成的球超出边界
		if (cir.x > (WIDTH - MaxRadius)){
			cir.x = MaxRadius;
		} 
		else if (cir.x < MaxRadius){
			cir.x = WIDTH - MaxRadius;
		}

		if (cir.y > (HEIGHT - MaxRadius)){
			cir.y = MaxRadius;
		}
		else if (cir.y < MaxRadius) {
			cir.y = HEIGHT - MaxRadius;
		}
		// if(cir.x < MaxRadius || cir.x > (WIDTH - MaxRadius)){
		// 	cir.x = randomNum(WIDTH - MaxRadius,MaxRadius );
		// }
		// if(cir.y < MaxRadius || cir.y > (HEIGHT - MaxRadius)){
		// 	cir.y = randomNum(HEIGHT-MaxRadius,MaxRadius);
		// }
	}
}

//调用执行
window.onload = function () {
	init();
	setInterval(function () {
		move();
		draw();
	}, 36);
}