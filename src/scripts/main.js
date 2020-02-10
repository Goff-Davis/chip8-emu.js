import Machine from './chip8/machine.js';

const debug = true;

const display = document.getElementById(`display`);
const startBtn = document.getElementById(`start`);
const stopBtn = document.getElementById(`stop`);

const vm = new Machine(display, null);

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

const readROM = (file, callback) => {
	const reader = new FileReader();

	reader.onload = event => {
		const buffer = event.target.result;
		const data = new Uint8Array(buffer);

		callback(data);
	};

	reader.readAsArrayBuffer(file);
};

startBtn.onclick = () => vm.start();
stopBtn.onclick = () => vm.stop();

const romName = `test1.ch8`;

fetch(`../../roms/${romName}`)
	.then(r => {
		console.log(r);
		console.log(typeof r);
		return r.blob();
	})
	.then(blob => {
		readROM(blob, rom => {
			vm.boot(rom);
		});
	});
