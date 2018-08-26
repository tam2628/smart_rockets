let target;
let population;
let count = 0;
let generation = 0 ;
let mutations = 0;
let maxFitIndex = 0;
  
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  target = { x:width/2 , y:90 };
  population = new Population();
  countP = createP();
  populationSize = createP();
  generationh3 = createElement('h3');
}

function draw() {
  count++;
  background(0);
  fill('#2367af');
  ellipse(target.x, target.y, 30, 30);
  population.start();
  textSize(32);
  fill("#fff");
  text("Generation: "+ (generation+1) , 10, 50);
  textSize(16);
  text("Population Size: "+ population.size , 12, 70);
  text("Frame elapsed: "+ count , 12, 90);
  text("Mutations made: "+ mutations, 12, 110);
  maxFitIndex = maxFit(population);

  if( count == population.lifespan ){
    population.evaluateFitness();
    population.selection();
    generation++;
    count = 0;
  }
}

function DNA(genes) {
  this.size = 300;
  this.genes = [];
  let newgenes = [];
  if ( genes !== null ) { this.genes = genes; }
  else{
    for ( let i = 0; i < this.size; i++ ) {
      this.genes.push(p5.Vector.random2D().setMag(0.1));
    }
  } 

  this.crossover = function (partner) {
    let n = floor(random(this.size));
    for ( let  i = 0 ; i < this.size; i++ ) {
      newgenes[i] = ( i < n ) ? this.genes[i] : partner.genes[i];
    }
    return mutation(newgenes);
  }

  mutation = function (genes)  {
    mutations = 0;
    for ( let i =0 ; i < genes.length ; i++ ) {
      if (random(1) < 0.01) {
        console.log("mutation");
        genes[i] = p5.Vector.random2D().setMag(0.1);
        mutations ++;
      }
    }
    return genes; 
  }

}

function Rocket(genes) {
  this.pos = createVector(width/2, height);
  this.vel = createVector(0, 0);
  this.accn = createVector(0, -1);
  this.dna = new DNA(genes);
  this.fitness = 0;
  
  this.addForce = function(force) {
    this.accn.add(force);
  } 
  
  this.update = function() {
    this.addForce(this.dna.genes[count]);
    this.pos.add(this.vel);
    this.vel.add(this.accn);
    this.accn.mult(0);
  }
  
  this.show = function() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    rectMode(CENTER);
    noStroke();
    rect(0, 0, 40, 10, 3);
    pop();
  }
  
  this.calcfitness = function() {
    let d = dist(this.pos.x, this.pos.y, target.x, target.y);
    this.fitness = map(d, 0, width, width, 0);
  }
  
}

function Population() {
  this.size = 28;
  this.lifespan = 300;
  this.rockets = [];
  this.matingpool = [];
  
  for( let i = 0; i < this.size; i++ ){
    this.rockets[i] = new Rocket(null);
  }
  
  this.evaluateFitness = function() {
    for(let i = 0; i < this.size; i++) {
      this.rockets[i].calcfitness();
    }
    this.matingpool = [];
    for(let i =0; i < this.size; i++ ) {
      let n = this.rockets[i].fitness * 100;
      for (let j =0 ;j < n; j++ ){
        this.matingpool.push(this.rockets[i]);
      }
    }
  }
    
  this.start = function() {
    for( let i = 0; i < this.size; i++ ){
      this.rockets[i].update();
      if ( i === maxFitIndex ) fill(0, 255, 0);
      else fill(255, 0, 0);
      this.rockets[i].show();
    }
  }

  this.selection = function() {
    let newRockets = [];
    for ( let i = 0; i< this.size; i++) {
      let parentA  =  random(this.matingpool).dna;
      let parentB  =  random(this.matingpool).dna;
      let child = parentA.crossover(parentB);
      newRockets[i] = new Rocket(child);
    }

    this.rockets = newRockets;

  }

}

function maxFit( population ) {
  let d = [];
  for ( let i = 0; i < population.size; i++ ) {
    d[i] = dist( population.rockets[i].pos.x, population.rockets[i].pos.y, target.x, target.y ); 
  }
  let max = 0; 
  for ( let i =0 ; i < d.length; i++ ){
    if ( d[max] > d[i] ) {
      max = i;
    }
  }
  return max;
}