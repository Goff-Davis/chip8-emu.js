const express = require(`express`);
const app = express();
const path = require(`path`);

app.use(express.static(`./src`))

app.get(`/`, (req, res) => {
	res.sendFile(path.join(`${__dirname}/src/index.html`));
});

app.listen(3000, () => {
	console.log(`Server listening on port localhost:3000`);
});
