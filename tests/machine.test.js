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
	});

	test(`start begins running the cpu steps and timers`, () => {
		const machine = defaultMachine();

		machine.start();

		// @TODO
		// properly mock the window to test if it ran
	});
});
