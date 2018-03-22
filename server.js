var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var Save = require("./models/Save.js");
var logger = require("morgan");
var cheerio = require("cheerio");
var path = require("path");
var app = express();
var exphbs = require("express-handlebars");
var PORT = process.env.PORT || 4000;


//*****************************************************//
// Middleware Sections;
// #Body parser 
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));

app.set("view engine", "handlebars");



//*****************************************************//
// Database Sections;
// connect to database
mongoose.Promise = Promise;
var dbConnect = process.env.MONGODB_URI || "mongodb://localhost/foxsScrape";
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
} else {
    mongoose.connect(dbConnect);
}

var db = mongoose.connection;
db.on('error', function (err) {
    console.log('Mongoose Error', err);
});
db.once('open', function () {
    console.log("Mongoose connection is successful");
});




//*****************************************************//
// Route Sections;
app.use(express.static("./public"));
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

require("./routes/scrape")(app);
require("./routes/html.js")(app);

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "views/index.html"));
});


//*****************************************************//
// Starting server
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
