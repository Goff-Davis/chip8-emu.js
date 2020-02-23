<h1 align="center">Chip8 Emulator</h1>

---

<p align="center"> A Chip8 emulator written in JavaScript.</p>

---

[![Netlify Status](https://api.netlify.com/api/v1/badges/0272b049-e476-480b-bf48-8d18a65e66ca/deploy-status)](https://app.netlify.com/sites/elastic-dubinsky-ead7c4/deploys)
[![GitHub Issues](https://img.shields.io/github/issues/Goff-Davis/chip8-emu.js.svg)](https://github.com/Goff-Davis/chip8-emu.js/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Goff-Davis/chip8-emu.js.svg)](https://github.com/Goff-Davis/chip8-emu.js/pulls)
[![License](https://img.shields.io/github/license/Goff-Davis/chip8-emu.js)](/LICENSE)

## Table of Contents
- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## About <a name = "about"></a>

This project was created as part of a presentation for the [University of Central Florda Techrangers](https://techrangers.cdl.ucf.edu/). It simulates the behavior of a [Chip8](https://en.wikipedia.org/wiki/CHIP-8). It does not match 1-to-1 the behavior and structure of a Chip8, but it follows it closely and the end result is the same.

## Getting Started <a name = "getting_started"></a>
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites
The latest version of node and npm is recommended. NVM is recommended for installing and managing node versions. The example given is for installing nvm and node in a Unix environment.

#### Installing nvm

Download and install the latest nvm version.
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v<latest nvm version>/install.sh | bash
```

Use the set environment variables.
```
source ~/.bashrc
```

#### Installing node (Latest 12 Version)

Install the latest node 12.
```
nvm install 12
```

Use that version.
```
nvm use 12
```

### Installing

Install the required packages.
```
npm install
```

Start the development server (updates on file changes)
```
npm run devstart
```

## Running the tests <a name = "tests"></a>

### Unit Tests

Tests the output of the JavaScript files. Primarily focuses on the emulator. The emulator tests MUST NOT fail.

```
npm run test
```

### Style Tests

My linting for a consistent environment. Mostly follows the default eslint configuration with some exceptions.

```
npm run lint
```

### ROM Tests

Within the roms folder is test1.ch8 and test2.ch8. You can run these tests on the live emulator to test the output.

#### Test 1

[Author's explanation.](https://slack-files.com/T3CH37TNX-F3RKEUKL4-b05ab4930d)

Gives error code. Look at the author's explanation to know what it means.

#### Test 2

Lists name of opcode and whether or not it passes.

## Usage <a name="usage"></a>
This was intended to be used as a static web page. The default listening port for the node server is 3000.

## Deployment <a name = "deployment"></a>
This can be deployed on with a static site hoster like [GitHub Pages](https://pages.github.com/) or [Netlify](https://www.netlify.com/). I personally am using Netlify. Specifiy the `public` folder as the build directory for it to be hosted correctly.

## Built Using <a name = "built_using"></a>
- [Vanilla JavaScript (es6+)](https://www.javascript.com/)

## Authors <a name = "authors"></a>
- [@Goff-Davis](https://github.com/Goff-Davis)

## Acknowledgements <a name = "acknowledgement"></a>
- [@chrisledet](https://github.com/chrisledet)
	- https://github.com/chrisledet/chip8.js
	- I referenced and used some portions of his code for the icky bitwise operations and conversions. I also used his implementation of canvas for the graphics.

- [Building a Chip-8 Emulator](https://austinmorlan.com/posts/chip8_emulator/)
	- Reference with C++ code examples.

- [Wikipedia page on Chip-8](https://en.wikipedia.org/wiki/CHIP-8)
	- Helpful reference for the opcodes.
