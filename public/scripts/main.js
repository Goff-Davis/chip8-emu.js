import Machine from './chip8/machine.js';

const debug = false;

const display = document.getElementById(`display`);
const power = document.getElementById(`power`);
const romSelect = document.getElementById(`roms`);
const clockRate = document.getElementById(`clock-rate`);
const upload = document.getElementById(`upload`);

const vm = new Machine(display, null, parseInt(clockRate.value));

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
const readROM = (file, callback) => {
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

power.onclick = event => {
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

clockRate.onchange = event => {
	vm.setClockRate(parseInt(event.target.value));
};

upload.onchange = event => {
	readROM(event.target.files[0]);
};

if (upload.value !== ``) {
	readROM(upload.files[0])
}
else {
	loadROM(romSelect.value);
}
