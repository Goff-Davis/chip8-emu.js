/* eslint-env jest */

// mock imports
import Chip8 from '../public/scripts/chip8/chip8.js';

jest.mock('../public/scripts/chip8/chip8.js');

// what we are testing
import Video from '../public/scripts/chip8/video.js';

const genVideo = () => (new Video({ width: 64, height: 32 }));

describe(`Video display`, () =>{
	beforeEach(() => {
		jest.resetModules();

		Chip8.mockClear();
	});

	test(`draw fills when an array item is true and clears when the item is false`, () => {
		const video = genVideo();
		const context = {
			fillStyle: `#000000`,
			fillRect: jest.fn(),
			clearRect: jest.fn()
		};

		video.container = {
			getContext: jest.fn(() => context)
		};

		const states = video.clearStates();

		video.draw(states);

		expect(context.clearRect).toHaveBeenCalledTimes(64 * 32);

		for (let i=0;i<states.length;i++) {
			for (let j=0;j<states[i].length;j++) {
				states[i][j] = true;
			}
		}

		video.draw(states);

		expect(context.fillRect).toHaveBeenCalledTimes(64 * 32);
	});

	test(`setDisplaySize changes the display, adjusts the pixel sizing, and redraws the display`, () => {
		const video = genVideo();

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
		const video = genVideo();

		video.states = `garbage`;

		const current = video.current();

		expect(current).toBe(`garbage`);
	});

	test(`clear draws clear states`, () => {
		const video = genVideo();

		video.draw = jest.fn();
		video.clearStates = jest.fn();

		video.clear();

		expect(video.draw).toHaveBeenCalledTimes(1);
		expect(video.clearStates).toHaveBeenCalledTimes(1);
	});

	test(`clearStates returns array of falses`, () => {
		const video = genVideo();

		const states = video.clearStates();

		states.forEach(column => {
			column.forEach(state => {
				expect(state).toBe(false);
			});
		});
	});
});
