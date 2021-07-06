var express = require("express"),
	app = express(),
	request = require("request"),
	bodyParser = require("body-parser"),
	expressSanitizer = require('express-sanitizer');
const PORT = process.env.PORT || 3000;

//Test using the body parser 
app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
 extended: true
 }));
//Rest of the settings
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());

app.get("/", function(req, res) {
	res.render("getRate");
});

app.get("/results", function(req, res){
    var query = req.sanitize(req.query.amount);
	// Don't use this: var userInput = req.body.amount;
	console.log("This is the value of query.amount: " + query);
    var url = "http://data.fixer.io/api/latest?access_key=8a31270dcf21bc8993b57ea28f81c9ce&symbols=USD,CAD,EUR,MXN";
   request(url, function(error, response, body){
    if(!error && response.statusCode == 200) {
        var data = JSON.parse(body);
		//Logic to be able to convert the input from fixer.
		data.rates['EUR'] = (data.rates['EUR'] * query).toFixed(2);
		data.rates['USD'] = (data.rates['USD'] * query).toFixed(2);
		data.rates['CAD'] = (data.rates['CAD'] * query).toFixed(2);
		data.rates['MXN'] = (data.rates['MXN'] * query).toFixed(2);
        res.render("results", {data: data});
    }
    });
});

//Implementation of the RESTFULL calls from SFDC get amount
app.get("/rates/:amount", (req, res) => {
	console.log(req.params);
	console.log(req.params.amount);
	//res.send("Ok, working and returning: " + req.params.amount);
	//Implement the logic to return JSON Then get this to heroku update and you'll have the app ready
	
	const url = "http://data.fixer.io/api/latest?access_key=8a31270dcf21bc8993b57ea28f81c9ce&symbols=USD,CAD,EUR,MXN";
   request(url, function(error, response, body){
    if(!error && response.statusCode == 200) {
        let data = JSON.parse(body);
		//Logic to be able to convert the input from fixer.
		//Returning JSON preparation
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({ 
			"EUR": (data.rates['EUR'] * req.params.amount).toFixed(2),
			"USD": (data.rates['USD'] * req.params.amount).toFixed(2),
			"CAD": (data.rates['CAD'] * req.params.amount).toFixed(2),
			"MXN": (data.rates['MXN'] * req.params.amount).toFixed(2),
								}));
		}
		});
});

app.listen(PORT, function() {
    console.log("App has started!");
});


	