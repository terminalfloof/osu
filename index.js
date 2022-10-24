const express = require("express");
const app = express();
const port = 3000;
let { Downloader, DownloadType, DownloadEntry } = require("osu-downloader");
let path = require("path");

app.use(require("cors")());

const downloader = new Downloader({
	rootPath: "./osz",
	filesPerSecond: 2,
});

app.get("/download/:id", (req, res) => {
	console.log(req.params);
	if (!req.params.id) {
		res.statusCode = 400;
		res.send("give me an id >:(");
	}
	//check if id passes regex test making sure it's a number
	else if (!/^\d+$/.test(req.params.id)) {
		res.statusCode = 400;
		res.send("that's not a number >:(");
	} else {
		downloader.addSingleEntry(
			new DownloadEntry({
				id: req.params.id,
				type: DownloadType.Set,
			})
		);
		downloader.downloadSingle().then((result) => {
			console.log(result);
			if (result.isSuccessful) {
				res.statusCode = 200;
				res.sendFile(path.join(__dirname, "osz", result.fileName));
			} else {
				res.statusCode = 404;
				res.send(
					"the download wasn't found on the servers. cry about it lol"
				);
			}
		});
	}
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
