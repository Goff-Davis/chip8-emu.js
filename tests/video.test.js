/* eslint-env jest */

// mock imports
import Chip8 from '../public/scripts/chip8/chip8.js';
import Machine from '../public/scripts/chip8/machine.js';

jest.mock('../public/scripts/chip8/chip8.js');
jest.mock('../public/scripts/chip8/machine.js');

// what we are testing
import Video from '../public/scripts/chip8/video.js';

const defaultVideo = () => (new Video({ width: 64, height: 32 }));

describe(`Video display`, () =>{
	beforeEach(() => {
		jest.resetModules();

		Chip8.mockClear();
		Machine.mockClear();
	});

	test(`setDisplaySize changes the display, adjusts the pixel sizing, and redraws the display`, () => {
		const video = defaultVideo();

		video.draw = jest.fn();
		video.current = jest.fn();

		video.setDisplaySize({ width: 128, height: 64 });

		expect(video.container.width).toBe(128);
		expect(video.container.height).toBe(64);
		expect(video.pixel.width).toBe(2);
		expect(video.pixel.height).toBe(2);
		expect(video.draw).toHaveBeenCalledTimes(1);
		expect(video.current).toHaveBeenCalledTimes(1);
	});

	test(`current returns the current states`, () => {
		const video = defaultVideo();

		video.states = `garbage`;

		const current = video.current();

		expect(current).toBe(`garbage`);
	});
});
