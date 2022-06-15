const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// import routes here
const googleScraper = require("./routes/google_scraper_route");
const bingScraper = require("./routes/bing_scraper_route");

// default configs
const app = express();
const PORT = 8080;
 
// CORS middleware
// - for calling the API from different locations by hitting endpoints in browser
app.use(cors());

// configs for body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/googlescraper', googleScraper);
app.use("/bingscraper", bingScraper);

// catch 404 and forward to error handler
app.use(function(request, response) {
  var error = new Error('Not Found');
  error.status = 404;
  next(err);
});

// error handler
app.use(function(error, request,response, next) {
  // set locals, only providing error in development
  response.locals.message = error.message;
  response.locals.error = request.app.get('env') === 'development' ? error : {};

  // render the error page
  response.status(error.status || 500);
  response.render('error');
});

app.get("/", (request, response) => {
  response.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});