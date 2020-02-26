/* eslint-env jest */

// what we are testing
import Chip8 from '../public/scripts/chip8/chip8.js';

const genChip = () => (new Chip8({ clear: jest.fn() }, null));

describe(`Chip8`, () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test(`load clears chip and copies rom`, () => {
		const chip = genChip();

		chip.clear = jest.fn();
		chip.copy = jest.fn();

		chip.load(`garbage`);

		expect(chip.clear).toHaveBeenCalledTimes(1);
		expect(chip.copy).toHaveBeenCalledTimes(1);
	});

	test(`clear fills everything with 0s and resets everything else`, () => {
		const chip = genChip();

		chip.registers = { fill: jest.fn() };
		chip.stack = { fill: jest.fn() };
		chip.memory = { fill: jest.fn() };
		chip.copy = jest.fn();
		chip.video = { clear: jest.fn() };

		chip.clear();

		expect(chip.registers.fill).toHaveBeenCalledTimes(1);
		expect(chip.registers.fill).toHaveBeenCalledWith(0, 0);
		expect(chip.stack.fill).toHaveBeenCalledTimes(1);
		expect(chip.stack.fill).toHaveBeenCalledWith(0, 0);
		expect(chip.memory.fill).toHaveBeenCalledTimes(1);
		expect(chip.memory.fill).toHaveBeenCalledWith(0, 0);
		expect(chip.copy).toHaveBeenCalledTimes(1);
		expect(chip.video.clear).toHaveBeenCalledTimes(1);
		expect(chip.delayTimer).toBe(0);
		expect(chip.soundTimer).toBe(0);
		expect(chip.pc).toBe(0x200);
	});

	test(`copy fills memory from start to data length`, () => {
		const chip = genChip();
		const data = [1, 1, 1, 1, 1];

		for (let i=0;i<5;i++) {
			chip.memory[0x200 + i] = 0;
		}

		chip.copy(0x200, data);

		for (let i=0;i<5;i++) {
			expect(chip.memory[0x200 + i]).toBe(1);
		}
	});

	test(`setInput sets chip input to given input`, () => {
		const chip = genChip();

		chip.setInput(`garbage`);

		expect(chip.input).toBe(`garbage`);
	});

	test(`step calls cpu cycle when not waiting on input`, () => {
		const chip = genChip();
		chip.cycle = jest.fn();
		chip.awaitInput = false;

		chip.step();

		expect(chip.cycle).toHaveBeenCalledTimes(1);
	});

	test(`step does not call cpu cycle when waiting on input`, () => {
		const chip = genChip();
		chip.cycle = jest.fn();
		chip.awaitInput = true;

		chip.step();

		expect(chip.cycle).toHaveBeenCalledTimes(0);
	});

	test(`stepTimer decrements timers when they are >0`, () => {
		const chip = genChip();
		chip.delayTimer = 2;
		chip.soundTimer = 2;

		chip.stepTimer();

		expect(chip.delayTimer).toBe(1);
		expect(chip.soundTimer).toBe(1);
	});

	test(`stepTimer does not decrement timers when they are 0`, () => {
		const chip = genChip();
		chip.delayTimer = 0;
		chip.soundTimer = 0;

		chip.stepTimer();

		expect(chip.delayTimer).toBe(0);
		expect(chip.soundTimer).toBe(0);
	});

	test(`stepTimer plays sound when soundTimer hits 0 after being not 0`, () => {
		const chip = genChip();
		chip.delayTimer = 0;
		chip.soundTimer = 1;
		chip.audio = {
			play: jest.fn()
		};

		chip.stepTimer();

		expect(chip.soundTimer).toBe(0);
		expect(chip.audio.play).toHaveBeenCalledTimes(1);
	});

	// this is a garbage way to test
	test(`random does not exceed the bounds`, () => {
		const chip = genChip();

		for (let i=0;i<512;i++) {
			const num = chip.getRand();

			expect(num >= 0).toBeTruthy();
			expect(num <= 255).toBeTruthy();
			expect(Math.floor(num)).toEqual(num);
		}
	});

	test(`byteToSwitch correctly sets t/f values`, () => {
		const chip = genChip();

		const result = chip.byteToSwitch(0x80);

		expect(result[0]).toBe(true);

		for (let i=1;i<result.length;i++) {
			expect(result[i]).toBe(false);
		}
	});

	test(`cycle gets the opcode, steps the pc, and executes the opcode`, () => {
		const chip = genChip();

		chip.pc = 0x200;
		chip.memory[0x200] = 0xFF;
		chip.memory[0x201] = 0xFF;
		chip.execute = jest.fn();

		chip.cycle();

		expect(chip.execute).toHaveBeenCalledTimes(1);
		expect(chip.execute).toHaveBeenCalledWith([0xFF, 0xFF]);
		expect(chip.pc).toBe(0x202);
	});

	test(`cycle restarts pc to start when it overflows`, () => {
		const chip = genChip();

		chip.pc = 0xFFE;
		chip.memory[0xFFE] = 0xFF;
		chip.memory[0xFFF] = 0xFF;
		chip.execute = jest.fn();

		chip.cycle();

		expect(chip.execute).toHaveBeenCalledTimes(1);
		expect(chip.execute).toHaveBeenCalledWith([0xFF, 0xFF]);
		expect(chip.pc).toBe(0x200);
	});
});
