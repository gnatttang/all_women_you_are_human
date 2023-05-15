let video;
let poseNet;
let myVideo;

let eyeRX = 0;
let eyeRY = 0;

let eyeLX = 0;
let eyeLY = 0;

let port, reader, writer;
let playButton;

async function preload() {
 myVideo = createVideo('FULL.mp4');
}

async function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.hide();
  video.size(width, height);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
  
  myVideo.hide();

  playButton = createButton("Play");
  playButton.position(width / 2 - 50, height / 2 + 100);
  playButton.mousePressed(startVideo);
  
  console.log('before getPort');
  noLoop();
  try {
    ({ port, reader, writer } = await getPort());
  } catch (error) {
    console.log('error:', error);
  }
  console.log('after getPort');
  loop();
}

async function startVideo() {
  myVideo.loop();
  myVideo.volume(0);
  myVideo.play();
  playButton.hide();
  loop();
}

async function gotPoses(poses) {
  if (poses.length > 0) {

    let eRX = poses[0].pose.keypoints[1].position.x;
    let eRY = poses[0].pose.keypoints[1].position.y;
    
    let eLX = poses[0].pose.keypoints[2].position.x;
    let eLY = poses[0].pose.keypoints[2].position.y;

    eyeRX = lerp(eyeRX, eRX, 0.5);
    eyeRY = lerp(eyeRY, eRY, 0.5);
    eyeLX = lerp(eyeLX, eLX, 0.5);
    eyeLY = lerp(eyeLY, eLY, 0.5);

  }
}

async function modelReady() {
  console.log('model ready');
}

async function draw(){
  background(0);

  let d = dist(eyeRX, eyeRY, eyeLX, eyeLY);
  console.log(d);
  strokeWeight(5);
  
  
  fill(255);
  rectMode(CENTER);
  rect(width/2, height/2, 300 + (d*0.9), 200 + (d*0.9));
  noStroke();
  imageMode(CENTER);
  
  image(myVideo, width/2, height/2, 300 + (d*0.9), 200 + (d*0.9));
  fill(255, 0 ,0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Distance: " + d.toFixed(2), width / 2, height - 50);
  

  //stroke(255, 0, 0);
  line(eyeRX, eyeRY, eyeLX, eyeLY);
  
  if (port) {
		try {
			if (d < 80) { //close
				await writer.write("50!\n");
			}else{ 
                await writer.write("0!\n");
            }
		} catch (e) { console.error(e) }
	}

}

function keyPressed(){
  if (keyCode === UP_ARROW) {
  let fs = fullscreen();
  fullscreen(!fs);
  }
}