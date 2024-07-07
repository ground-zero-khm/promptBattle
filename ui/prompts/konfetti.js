let konfettiSystem_Left;
let konfettiSystem_Right;

const amount = 3;
let counter = 0;

function celebrate() {
	const looping = setInterval(() => {
		counter++;

		if (counter >= amount) {
			clearInterval(looping)
		}

		konfettiSystem_Left.addParticle();
		konfettiSystem_Right.addParticle();
	}, 300)
}

function celebrate_left() {
	const looping = setInterval(() => {
		counter++;

		if (counter >= amount) {
			clearInterval(looping)
		}

		konfettiSystem_Left.addParticle();
	}, 300)
}

function celebrate_right() {
	const looping = setInterval(() => {
		counter++;

		if (counter >= amount) {
			clearInterval(looping)
		}
		konfettiSystem_Right.addParticle();
	}, 300)
}


function setup() {
	const canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('konfetti');
	frameRate(60);
  	colorMode(HSB);
	konfettiSystem_Left = new KonfettiSystem(createVector(-100, height + 75),createVector(6, -16));
	konfettiSystem_Right = new KonfettiSystem(createVector(width+100, height + 75),createVector(-6, -16));
}

function draw() {
	clear();
	konfettiSystem_Left.run();
	konfettiSystem_Right.run();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let KonfettiSystem = function(_position,_direction) {
	this.origin = _position.copy(); 	
  this.direction = _direction.copy();
	this.particles = [];
};

KonfettiSystem.prototype.addParticle = function() {
  //prevent overflow
  if(this.particles.length <= 1500){
  let n = random(240, 400);
  for(let s=0;s<n;s++){
	   this.particles.push(new Particle(this.origin,this.direction));
  }}
};

KonfettiSystem.prototype.run = function() {
	for (let i = this.particles.length - 1; i >= 0; i--) {
		let p = this.particles[i];
		p.run();
		if (p.isDead()) {
			this.particles.splice(i, 1);
		}
	}
};

// A simple Particle class
let Particle = function(position, direction) {
	this.acceleration = createVector(0, 0.1);
	this.velocity = createVector(random(direction.x), random(-abs(direction.x),direction.y));
	this.position = position.copy();
  	this.rotation = random(PI);
	this.lifespan = 15;
	this.color = color(random(255),255,255);
};

Particle.prototype.run = function() {
	this.update();
	this.display();
};

Particle.prototype.update = function() {
	this.velocity.add(this.acceleration);
	this.position.add(this.velocity);
	this.lifespan *= 0.99;
};

Particle.prototype.display = function() {
	noStroke();
	fill(this.color, this.lifespan);
  	push();
  	translate(this.position.x, this.position.y);
  	rotate(this.rotation+(this.lifespan));
	rect(0,0, this.lifespan, this.lifespan*0.5);
  	pop();
};

Particle.prototype.isDead = function() {
	return this.lifespan < 1;
};
