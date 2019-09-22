var express = require("express"),
	app = express(),
	request = require("request");
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
	res.render("getRate");
});

app.listen(PORT, function() {
    console.log("App has started!");
});


	