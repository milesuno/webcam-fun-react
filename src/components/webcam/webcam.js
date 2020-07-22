import React, { Component } from "react";
import "./webcam.css";
class Webcam extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		//Video to store webcam stream
		const video = document.querySelector(".player");
		const canvas = document.querySelector(".photo");
		const button = document.querySelector("button");

		//To store snapspot shot of video stream
		//Canvas where video snap is store periodically
		const controls = document.querySelector(".controls");

		// controls.appendChild(redSlider);

		this.getVideo();
		// drawToCanvas();
		//once video.play() is called canplay event is fired
		video.addEventListener("canplay", this.drawToCanvas);
		button.addEventListener("click", this.takePhoto);
	}

	componentWillMount() {
		clearInterval(this.state.drawnImage);
	}
	getVideo = async function () {
		const video = document.querySelector(".player");

		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: false,
		});
		video.srcObject = stream;
		video.play();
	};

	drawToCanvas = () => {
		//videoWidth/videoHeight properties return 0. This may be an issue of when the values are being evaluated
		const video = document.querySelector(".player");
		const canvas = document.querySelector(".photo");
		const ctx = canvas.getContext("2d");
		const width = video.videoWidth;
		const height = video.videoHeight;

		canvas.height = height;
		canvas.width = width;
		let drawnImage = setInterval(() => {
			ctx.drawImage(video, 0, 0, width, height);
			let pixels = ctx.getImageData(0, 0, width, height);
			pixels = this.redFilter(pixels);
			pixels = this.greenFilter(pixels);
			pixels = this.blueFilter(pixels);
			ctx.putImageData(pixels, 0, 0);
		}, 2);
		this.setState({ drawnImage });
		// return drawnImage;
	};

	takePhoto = () => {
		const snap = document.querySelector(".snap");
		const canvas = document.querySelector(".photo");
		const strip = document.querySelector(".strip");

		//reset snap before playing the sound
		snap.currentTime = 0;
		snap.play();
		const data = canvas.toDataURL("jpeg");
		const link = document.createElement("a");
		link.href = data;
		link.download = "130 IQ ;)";
		link.innerHTML = `<img src="${data}"/>`;
		strip.appendChild(link);
	};

	redFilter = (pixels) => {
		const redSlider = document.querySelector("#red");
		for (let i = 0; i < pixels.data.length; i += 4) {
			redSlider.defaultValue = pixels.data[i];
			if (redSlider.valueAsNumber) {
				pixels.data[i] = redSlider.valueAsNumber;
			}
		}
		return pixels;
	};

	greenFilter = (pixels) => {
		const greenSlider = document.querySelector("#green");
		for (let i = 0; i < pixels.data.length; i += 4) {
			greenSlider.defaultValue = pixels.data[i + 1];
			if (greenSlider.valueAsNumber) {
				pixels.data[i + 1] = greenSlider.valueAsNumber;
			}
		}
		return pixels;
	};

	blueFilter = (pixels) => {
		const blueSlider = document.querySelector("#blue");
		for (let i = 0; i < pixels.data.length; i += 4) {
			blueSlider.defaultValue = pixels.data[i + 2];
			if (blueSlider.valueAsNumber) {
				pixels.data[i + 2] = blueSlider.valueAsNumber;
			}
		}
		return pixels;
	};

	render() {
		return (
			<body>
				<div class="controls">
					<button>Take Photo</button>
					<div class="rgb">
						<label for="red">Red:</label>
						<input
							type="range"
							min="0"
							max="255"
							id="red"
							name="red"
						/>
						<label for="green">Green:</label>
						<input
							type="range"
							min="0"
							max="255"
							id="green"
							name="green"
						/>

						<label for="blue">Blue:</label>
						<input
							type="range"
							min="0"
							max="255"
							id="blue"
							name="blue"
						/>
					</div>
				</div>

				<div class="photobooth">
					<canvas class="photo"></canvas>
					<video class="player"></video>
					<div class="strip"></div>
				</div>

				{/* <audio
					class="snap"
					src="http://wesbos.com/demos/photobooth/snap.mp3"
					hidden
				></audio> */}

				<script src="scripts.js"></script>
			</body>
		);
	}
}

export default Webcam;
