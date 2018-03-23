var circ_size = 10;
var multiplier = 2;
var radius = 350;
var x_offset = 400;
var y_offset = 400;

function x_from_number(number) {
  var degree = (number / circ_size)*2*Math.PI;
  return x_offset + (Math.sin(degree) * radius);
};

function y_from_number(number) {
  var degree = (number/circ_size)*2*Math.PI;
  return y_offset + (Math.cos(degree) * radius);
};

function setup() {
  // Sets the screen to be 720 pixels wide and 400 pixels high
  createCanvas(800, 800);
  noLoop();

}

function draw() {
  // Set the background to black and turn off the fill color
  background(0);
  stroke("green");
  ellipse(x_offset,y_offset,radius*2,radius*2);
  stroke("black");
  for(var i = 0; i < circ_size; i = i+1) {
    line(x_from_number(i), y_from_number(i), x_from_number(multiplier*i), y_from_number(multiplier*i));
  }

}
function update(event) {
  circ_size = document.getElementById("circ_size").value;
  multiplier = document.getElementById("multiplier").value;
  redraw();
}


