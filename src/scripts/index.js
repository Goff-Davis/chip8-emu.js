import Machine from './chip8/machine.js';

const display = document.getElementById(`display`);
const startBtn = document.getElementById(`start`);
const stopBtn = document.getElementById(`stop`);

const vm = new Machine(display, null);

const readROM = (file, callback) => {
	const reader = new FileReader();

	reader.onload = event => {
		const buffer = event.target.result;
		const data = newUint8Array(buffer);

		callback(data);
	};

	reader.readAsArrayBuffer(file);
};

startBtn.onclick = () => vm.start();
stopBtn.onclick = () => vm.stop();

const romName = `test1.ch8`;

fetch(`../../roms/${romName}`)
	.then(r => r.blob())
		.then(blob => {
			readROM(blob, rom => { vm.boot(rom); });
		});

// might be unneeded
window.chip8vm = vm;
