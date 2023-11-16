const http = require('http');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
	".html": "text/html",
	".js": "text/javascript",
	".css": "text/css",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpg"
}

const ERR_NO_ENTITY = "ENOENT";

const server = http.createServer((req, res) => {
	
	/*
	if (req.url === "/") {
		fs.readFile(
			path.join(__dirname, "public", "index.html"),
			(err, content) => {
				if (err) throw err;
				
				res.writeHead(200, {
					"Content-Type": "text/html"
				});
				res.end(content);
			});
		
	} else if (req.url === "/about") {
		fs.readFile(
			path.join(__dirname, "public", "about.html"),
			(err, content) => {
				if (err) throw err;
				
				res.writeHead(200, {
					"Content-Type": "text/html"
				});
				res.end(content);
			});
	} else if (req.url === "/api/users") {
		const users = [
			{ name: "Bob Smith", age: 40 },
			{ name: "John Doe", age: 30 }
		];
		res.writeHead(200, {
			"Content-Type": "application/json"
		});
		res.end(JSON.stringify(users));
	}
	*/
	
	
	//Build file path
	let filePath = path.join(__dirname, 'public',
		(req.url === '/') ? "index.html" : req.url);
	
	//Extension of file
	let extname = path.extname(filePath);
	
	//I did this differently.
	let contentType = MIME_TYPES[extname] || "text/html";
	
	//Read file
	fs.readFile(filePath, (err, content) => {
		if (err) {
			if (err.code == ERR_NO_ENTITY) {
				//Page not found
				fs.readFile(
					path.join(__dirname, "public", "404.html"),
					(err, content) => {
						if (err) throw err;
						
						res.writeHead(404, {
							"Content-Type": "text/html"
						});
						res.end(content, "utf8");
					});
			} else {
				// Some server error
				res.writeHead(500, {
					"Content-Type": "text/html"
				});
				
				res.end(`Server error: ${err.code}`);
			}
		} else {
			//Success
			console.log(`Serving content ${filePath} as ${contentType}`);
			res.writeHead(200, {
				"Content-Type": contentType
			});
			res.end(content, "utf8");
		}
	});
	
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
	console.log("Server listening on port ", PORT);
});
