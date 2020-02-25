/* eslint-env jest */

// mock imports
import Chip8 from '../public/scripts/chip8/chip8.js';
import Video from '../public/scripts/chip8/video.js';

jest.mock('../public/scripts/chip8/chip8.js');
jest.mock('../public/scripts/chip8/video.js');

// what we are testing
import Machine from '../public/scripts/chip8/machine.js';

const defaultMachine = () => {
	return (new Machine(jest.fn(), 300, { error: jest.fn(), clearError: jest.fn() }));
};

describe(`Virtual Machine`, () => {
	beforeEach(() => {
		jest.resetModules();

		Chip8.mockClear();
		Video.mockClear();

		global.setInterval = jest.fn();
		global.clearInterval = jest.fn();
	});

	test(`start begins running the cpu steps and timers`, () => {
		const machine = defaultMachine();

		machine.start();

		expect(global.setInterval).toHaveBeenCalledTimes(2);
	});

	test(`start does not interfere with currently running cpu steps and timers`, () => {
		const machine = defaultMachine();

		machine.stepID = `garbage`;

		machine.start();

		expect(global.setInterval).toHaveBeenCalledTimes(0);

		machine.stepID = null;
		machine.timerID = `garbage`;

		machine.start();

		expect(global.setInterval).toHaveBeenCalledTimes(0);
	});

	test(`stop stops running intervals and sets IDs to null`, () => {
		const machine = defaultMachine();

		machine.stepID = `garbage`;
		machine.timerID = `garbage`;

		machine.stop();

		expect(global.clearInterval).toHaveBeenCalledTimes(2);
		expect(machine.stepID).toBe(null);
		expect(machine.timerID).toBe(null);

		// running when stopped should not waste clearing intervals
		machine.stop();

		expect(global.clearInterval).toHaveBeenCalledTimes(2);
		expect(machine.stepID).toBe(null);
		expect(machine.timerID).toBe(null);
	});

	test(`reset clears errors, stops the machine, and resets the cpu`, () => {
		const machine = defaultMachine();

		machine.clearError = jest.fn();
		machine.stop = jest.fn();
		machine.chip.reset = jest.fn();

		machine.reset();

		expect(machine.clearError).toHaveBeenCalledTimes(1);
		expect(machine.stop).toHaveBeenCalledTimes(1);
		expect(machine.chip.reset).toHaveBeenCalledTimes(1);
	});

	test(`setInput passes on the input to the chip`, () => {
		const machine = defaultMachine();

		machine.chip.setInput = jest.fn();

		machine.setInput(`garbage`);

		expect(machine.chip.setInput).toHaveBeenCalledTimes(1);
	});

	test(`setClockRate stops the cpu to set the new clock rate, then restarts`, () => {
		const machine = defaultMachine();

		machine.stop = jest.fn();
		machine.start = jest.fn();
		machine.clockRate = 300;

		machine.setClockRate(1000);

		expect(machine.stop).toHaveBeenCalledTimes(1);
		expect(machine.clockRate).toBe(1000);
		expect(machine.start).toHaveBeenCalledTimes(1);
	});

	test(`setDisplaySize passes the new display to the video`, () => {
		const machine = defaultMachine();

		machine.video.setDisplaySize = jest.fn();

		machine.setDisplaySize(`garbage`);

		expect(machine.video.setDisplaySize).toHaveBeenCalledTimes(1);
	});

	test(`boot clears errors, stops the cpu, passes the rom to the chip, then starts the cpu`, () => {
		const machine = defaultMachine();

		machine.clearError = jest.fn();
		machine.stop = jest.fn();
		machine.chip.load = jest.fn();
		machine.start = jest.fn();

		machine.boot(`garbage`);

		expect(machine.clearError).toHaveBeenCalledTimes(1);
		expect(machine.stop).toHaveBeenCalledTimes(1);
		expect(machine.chip.load).toHaveBeenCalledTimes(1);
		expect(machine.start).toHaveBeenCalledTimes(1);
	});
});
