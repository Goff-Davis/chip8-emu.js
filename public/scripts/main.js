import Machine from './chip8/machine.js';

document.getElementById(`year`).innerHTML = new Date().getFullYear();

const display = document.getElementById(`display`);
const power = document.getElementById(`power`);
const romSelect = document.getElementById(`roms`);
const screenSizeMultiplier = document.getElementById(`screen-size-multiplier`);
const clockRate = document.getElementById(`clock-rate`);
const upload = document.getElementById(`upload`);
const ctrlToggle = document.getElementById(`ctrl-toggle`);
const controls = document.getElementById(`controls`);
const errorNotifier = document.getElementById(`error-notifier`);

// gets input keys for the machine
document.onkeydown = event => {
	let input;

	switch(event.key) {
		case `1`:
			input = 0x1;
			break;
		case `2`:
			input = 0x2;
			break;
		case `3`:
			input = 0x3;
			break;
		case `4`:
			input = 0xC;
			break;
		case `q`:
			input = 0x4;
			break;
		case `w`:
			input = 0x5;
			break;
		case `e`:
			input = 0x6;
			break;
		case `r`:
			input = 0xD;
			break;
		case `a`:
			input = 0x7;
			break;
		case `s`:
			input = 0x8;
			break;
		case `d`:
			input = 0x9;
			break;
		case `f`:
			input = 0xE;
			break;
		case `z`:
			input = 0xA;
			break;
		case `x`:
			input = 0x0;
			break;
		case `c`:
			input = 0xB;
			break;
		case `v`:
			input = 0xF;
			break;
		default:
			input = -1;
			break;
	}

	if (input !== -1) {
		vm.setInput(input);
	}
};

// reads the file and passes to vm
const readROM = file => {
	const reader = new FileReader();

	reader.onload = event => {
		const buffer = event.target.result;
		const data = new Uint8Array(buffer);

		vm.boot(data);
	};

	reader.readAsArrayBuffer(file);
};

// retrieves selected file
const loadROM = name => {
	fetch(`../../roms/${name}`)
		.then(r => r.blob())
		.then(blob => {
			readROM(blob);
		});
};

// update size of chip8 display
const setDisplaySize = multiplier => {
	display.width = 64 * multiplier;
	display.height = 32 * multiplier;

	vm.setDisplaySize(display);
};

// show error message
const error = () => {
	errorNotifier.innerHTML = `Something went wrong while running this ROM. Please reload the page and try again or try a different ROM. Check the browser's console for details.`;
	errorNotifier.setAttribute(`aria-hidden`, `false`);
};

// hide error message
const clearError = () => {
	errorNotifier.setAttribute(`aria-hidden`, `true`);
	errorNotifier.innerHTML = ``;
};

// toggle vm on and off
power.onclick = () => {
	if (power.innerHTML === `Start`) {
		power.innerHTML = `Stop`;
		vm.start();
	}
	else {
		power.innerHTML = `Start`;
		vm.stop();
	}
};

romSelect.onchange = event => {
	loadROM(event.target.value);
};

screenSizeMultiplier.onchange = event => {
	setDisplaySize(parseInt(event.target.value));
};

clockRate.onchange = event => {
	vm.setClockRate(parseInt(event.target.value));
};

upload.onchange = event => {
	readROM(event.target.files[0]);
};

ctrlToggle.onclick = () => {
	if (controls.getAttribute(`aria-hidden`) === `true`) {
		controls.setAttribute(`aria-hidden`, `false`);
	}
	else {
		controls.setAttribute(`aria-hidden`, `true`);
	}
};

// create vm and set the display size
const vm = new Machine(display, parseInt(clockRate.value), { error: error, clearError: clearError });
setDisplaySize(parseInt(screenSizeMultiplier.value));

// either load a user uploaded ROM or the selected ROM
if (upload.value !== ``) {
	readROM(upload.files[0]);
}
else {
	loadROM(romSelect.value);
}
