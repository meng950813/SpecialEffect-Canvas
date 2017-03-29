var clock=document.getElementById('clock');

var width = clock.getAttribute('width');
var height = clock.height;
// console.log(width+"   "+height);
var rotateX = width/2;
var rotateY = height/2;
var cxt=clock.getContext('2d');

function time_clock () {

	//清除上次画布内容
	cxt.clearRect(0,0,width,height);

	var now=new Date();//获取当前时间
	var sec=now.getSeconds();//获取秒
	var min=now.getMinutes();//获取分
	var hour=now.getHours()%12;//获取12小时制的时间
	// hour=hour>12?hour-12:hour;
	//必须获取浮点型(时+分 转化的小时)，以保证时针不会只指在整点位置
	hour=hour+min/60;
	//画表盘（蓝色）
		cxt.lineWidth=10;
		cxt.strokeStyle="blue";
		cxt.beginPath();
		// 圆心坐标，半径，起始角度，终止角度，
		cxt.arc(rotateX,rotateY,200,0,2*Math.PI,true); 
		cxt.closePath();
		cxt.stroke();
	//刻度
		//时刻度 
			for (var i= 0;i<12;i++) {
				cxt.save();
				cxt.lineWidth=6;//设置时针粗细
				cxt.strokeStyle="#000";//设置时针颜色

				cxt.translate(rotateX,rotateY);//设置旋转点(坐标原点)
				//设置旋转角度
				cxt.rotate(i*30*Math.PI/180);//算法：角度*Math.PI /180 = 弧度
				cxt.beginPath();
				cxt.moveTo(0,-170);
				cxt.lineTo(0,-190);
				cxt.closePath();
				cxt.stroke();
				cxt.restore();
			}
		//分刻度
			for (var i = 0; i < 60; i++) {
				cxt.save();
				cxt.lineWidth=4;//设置分刻度粗细
				cxt.strokeStyle="#000";//设置分针颜色
				//设置或者重制画布的 (0,0)点
				cxt.translate(rotateX,rotateY);
				//设置旋转角度
				cxt.rotate(i*6*Math.PI/180);
				//画分针
				cxt.beginPath();
				cxt.moveTo(0,-180);
				cxt.lineTo(0,-190);
				cxt.closePath();
				cxt.stroke(); 
				cxt.restore();
			}
	//时针
		cxt.save();
		//设置时针风格
		cxt.lineWidth=4;//粗细
		cxt.strokeStyle="#000";//颜色
		
		cxt.translate(rotateX,rotateY);//设置异次空间的 (0,0) 点
		cxt.rotate(hour*30*Math.PI/180);//设置旋转角度
		cxt.beginPath();
		cxt.moveTo(0,-140);
		cxt.lineTo(0,10);
		cxt.closePath();
		cxt.stroke();
		cxt.restore();
	//分针
		cxt.save();
		cxt.translate(rotateX,rotateY);
		cxt.rotate(min*6*Math.PI/180);
		cxt.lineWidth=2.5;
		cxt.strokeStyle="#000";
		cxt.beginPath();
		cxt.moveTo(0,-155);
		cxt.lineTo(0,15);
		cxt.closePath();
		cxt.stroke();
		cxt.restore();
	//秒针
		cxt.save();
		cxt.translate(rotateX,rotateY);
		cxt.rotate(sec*6*Math.PI/180);
		cxt.lineWidth=2;
		cxt.strokeStyle="red";
		cxt.beginPath();
		cxt.moveTo(0,-165);
		cxt.lineTo(0,20);
		cxt.closePath();
		cxt.stroke();
		
	//画时针，分针，秒针的交叉点
		cxt.beginPath();
		cxt.arc(0,0,5,0,2*Math.PI,false);
		cxt.fillStyle="gray";
		cxt.fill();
		cxt.closePath();
		cxt.stroke();

	//画秒针前端的圆点
		cxt.beginPath();
		cxt.arc(0,-150,5,0,2*Math.PI,true)
		cxt.fill();
		cxt.closePath();
		cxt.stroke();
		cxt.restore();
}
//调用setInterval(代码,毫秒时间) 函数，重制画布,让时钟动起来
time_clock();//先调用一次，避免刷新时出现1秒的空白时间
setInterval(time_clock,1000);//间隔1秒