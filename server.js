var port = process.env.PORT || 3000;  
var express = require('express');
var app = express();
var mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/node-blog")
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
var postSchema = new mongoose.Schema({title: String, subtitle: String, idtitle: String, date: String, body: String });
var Post = mongoose.model('Post', postSchema);
var marked = require ('marked');
var dateFormat = require('dateformat');

// Routes

/*
app.get('/*.*', function(req, res) {

});
*/

app.post('/addpost', (req, res) => {
	console.log(req.body);
	var day=dateFormat(new Date(), "yyyy/mm/dd h:MM:ss").toString();
	req.body.idtitle=req.body.title.toLowerCase().replace(/\s/g, '-');
	req.body.date=day;

	var postData = new Post(req.body);
	postData.save().then( result => {
		res.redirect('/');
	}).catch(err => {
		res.status(400).send("Unable to save data");
	});
});

app.get('/addpost', (req, res) => {
	 res.sendFile("/addpost.html",{root: __dirname+"/views"});
});


app.get("/:post", (req, res) => {

	var md = function (txt) {

      var html = marked (txt);

      return html;
   };


	Post.find({idtitle:req.params.post}, (err, posts) => {
	res.render('post', { post: posts[0], md: md});
	});


});


app.get("/", (req, res) => {

	Post.find({}, (err, posts) => {
		console.log(posts);
		res.render('index', { posts: posts});
	});

});

app.listen(port, function () {
	console.log("ligado");
});

app.use(express.static(__dirname + '/'));