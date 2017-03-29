;
var fireworks = function(options) {
    // set the defaults
    options = options || {};

    // 初始化参数 ==> 设置 canvas特效：透明度，宽高
    options.opacity = options.opacity || 1;
    options.width = options.width || document.body.clientWidth || document.documentElement.clientWidth;
    options.height = options.height || document.body.clientHeight || document.documentElement.clientHeight;

    var particles = [], // 粒子
        rockets = [], // 火箭 ==> 爆炸前的烟花束
        MAX_PARTICLES = 400, // 最大粒子数
        SCREEN_WIDTH = options.width, 
        SCREEN_HEIGHT = options.height;

    // create canvas and get the context
    // var canvas = document.createElement('canvas');
    // canvas.id = "fireworksField";
    var canvas = document.getElementById('fireworksField');

    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    canvas.style.width  = SCREEN_WIDTH + 'px';
    canvas.style.height = SCREEN_HEIGHT + 'px';
    canvas.style.position = 'absolute';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.opacity = options.opacity;
    var context = canvas.getContext('2d');

    // The Particles Object
    function Particle(pos) {
        this.pos = {
            x: pos ? pos.x : 0,
            y: pos ? pos.y : 0
        };
        this.vel = {
            x: 0,
            y: 0
        };
        this.shrink = 0.97; // 粒子缩小度
        this.size = 2; // 粒子尺寸

        this.resistance = 1; // 粒子运动速度
        this.gravity = 0; // 粒子纵向运动速度

        this.flick = false; // 弹性尺寸 ==> 决定粒子尺寸是否一致

        this.alpha = 1; // 粒子透明度
        this.fade = 0; // 每次粒子透明度减小度
        this.color = 0; // 颜色
    }

    // 更新粒子位置函数
    Particle.prototype.update = function() {
        // apply resistance
        // 设置粒子爆炸带来的位移
        this.vel.x *= this.resistance;
        this.vel.y *= this.resistance;

        // gravity down
        // 设置粒子应该下落的位移
        this.vel.y += this.gravity;

        // update position based on speed
        // 设置粒子位置
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // shrink
        // 设置粒子尺寸
        this.size *= this.shrink;

        // fade out
        // 设置透明度
        this.alpha -= this.fade;
    };

    // 渲染函数 ==> 绘制一个粒子
    Particle.prototype.render = function(c) {
        // 当前粒子没有渲染必要 
        if (!this.exists()) {
            return;
        }

        c.save();

        // canvas 方法, 
        // 'lighter' ==> 新图像绘制到canvas后，能与 初始图像一起显示
        // ==> 注释之后并不影响效果。。。(滑稽)
        c.globalCompositeOperation = 'lighter';

        var x = this.pos.x,
            y = this.pos.y,
            r = this.size / 2;

        // 设置渐变色
        var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
            gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
            gradient.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
            gradient.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");

        c.fillStyle = gradient;

        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
        c.closePath();
        c.fill();

        c.restore();
    };

    // 根据粒子透明度和尺寸判断粒子能否显示
    Particle.prototype.exists = function() {
        return this.alpha >= 0.1 && this.size >= 1;
    };

    // The Rocket Object
    function Rocket(x) {
        // 固定烟花的发射位置
        Particle.apply(this, [{ x: x, y: SCREEN_HEIGHT}]);

        // 烟花爆炸颜色
        this.explosionColor = 0;
    }

    // 构建原型链 : Robket 成为 Particle 的子类
    Rocket.prototype = new Particle();
    Rocket.prototype.constructor = Rocket;

    // 爆炸特效函数
    Rocket.prototype.explode = function() {
        // 爆炸生产粒子数  (80,90)
        var count = Math.random() * 10 + 80;

        for (var i = 0; i < count; i++) {
            // this.pos 指 继承来的 pos 
            var particle = new Particle(this.pos);
            
            // 生成随机角度 ==> 爆炸粒子能向四周扩散
            var angle = Math.random() * Math.PI * 2; 

            // emulate 3D effect by using cosine and put more particles in the middle
            // 随机生成粒子扩散速度 (0,15)
            var speed = Math.cos(Math.random() * Math.PI / 2) * 15;

            // 初始化对象数据
            particle.vel.x = Math.cos(angle) * speed;
            particle.vel.y = Math.sin(angle) * speed;

            particle.size = 10;

            particle.gravity = 0.2;
            particle.resistance = 0.92;
            particle.shrink = Math.random() * 0.05 + 0.93;

            particle.flick = true;
            particle.color = this.explosionColor;

            particles.push(particle);
        }
    };

    // 渲染爆炸前的粒子
    Rocket.prototype.render = function(c) {
        if (!this.exists()) {
            return;
        }

        c.save();
        // 两块内容同时显示
        c.globalCompositeOperation = 'lighter';

        var x = this.pos.x,
            y = this.pos.y,
            r = this.size / 2;

        var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
            gradient.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
            gradient.addColorStop(1, "rgba(0, 0, 0, " + this.alpha + ")");

        c.fillStyle = gradient;

        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
        c.closePath();
        c.fill();

        c.restore();
    };

    var loop = function() {
        // js控制 响应式 ==> 每次循环都判断窗口宽高
        if (SCREEN_WIDTH != window.innerWidth) {
            canvas.width = SCREEN_WIDTH = window.innerWidth;
        }
        if (SCREEN_HEIGHT != window.innerHeight) {
            canvas.height = SCREEN_HEIGHT = window.innerHeight;
        }

        // clear canvas
        context.fillStyle = "rgba(0, 0, 0, 0.05)";
        context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        var existingRockets = [];

        for (var i = 0; i < rockets.length; i++) {
            // update and render
            rockets[i].update();
            rockets[i].render(context);

            // calculate distance with Pythagoras
            // 利用勾股定理(毕达哥拉斯定理)计算距离
            var distance = Math.sqrt(Math.pow(SCREEN_WIDTH - rockets[i].pos.x, 2) + Math.pow(SCREEN_HEIGHT - rockets[i].pos.y, 2));

            // random chance of 1% if rockets is above the middle
            var randomChance = rockets[i].pos.y < (SCREEN_HEIGHT * 2 / 3) ? (Math.random() * 100 <= 1) : false;

            /* Explosion rules
            - 80% of screen
            - going down
            - close to the mouse
            - 1% chance of random explosion
            */
            if (rockets[i].pos.y < SCREEN_HEIGHT / 5 || rockets[i].vel.y >= 0 || distance < 50 || randomChance) {
                rockets[i].explode();
            } else {
                existingRockets.push(rockets[i]);
            }
        }

        rockets = existingRockets;

        var existingParticles = [];

        for (i = 0; i < particles.length; i++) {
            particles[i].update();

            // render and save particles that can be rendered
            if (particles[i].exists()) {
                particles[i].render(context);
                existingParticles.push(particles[i]);
            }
        }

        // update array with existing particles - old particles should be garbage collected（垃圾回收）
        particles = existingParticles;

        while (particles.length > MAX_PARTICLES) {
            particles.shift();
        }
    };

    // 造烟花
    var launchFrom = function(x) {
        if (rockets.length < 10) {
            var rocket = new Rocket(x);
            rocket.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
            rocket.vel.y = Math.random() * -3 - 4;
            rocket.vel.x = Math.random() * 6 - 3;
            rocket.size = 8;
            rocket.shrink = 0.999;
            rocket.gravity = 0.01;
            rockets.push(rocket);
        }
    };

    var launch = function() {
        launchFrom(SCREEN_WIDTH / 2);
    };

    // 启动循环
    setInterval(launch, 500);
    setInterval(loop, 1000 / 100);


};


fireworks({ 
  opacity: 1, 
  width: '100%', 
  height: '100%' 
});

