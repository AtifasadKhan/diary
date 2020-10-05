//import
const express   = require('express');
      app       = express();
   bodyParser   = require('body-parser');
	 mongoose   = require('mongoose');
//abhi edit and del ayaaa so bhai sahab method over-ride ayega abhi
methodOverride  = require('method-override');
expressSanitizer= require('express-sanitizer');
//connect to mongodb
 mongoose.connect('mongodb://localhost/confession', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

//to override that put
// app.use me _mthod likha it should be same as the _method in ejs
app.use(methodOverride('jhol'));

app.use(expressSanitizer());

// You need to use bodyParser() if you want the form data to be available in req.body.
app.use(bodyParser.urlencoded({ extended: true }));
//set  ejs
app.set('view engine', 'ejs');
//to use css
app.use(express.static('public'));
//title 
//image
//body
//created (for dates)
 //create schema
const subj = mongoose.model('subj', { 
	name:  String,
	body:   String,
	created:{type: Date, default: Date.now}// grab current date 	
});

// db test
// subj.create({
// 	name:"Test",
// 	body:"This is a blog app"
// })

// op
app.get("/home",function(req,res){
	subj.find(function(err,milja){
		if(err){
			console("home me error");
		}else{
			res.render("index",{data:milja})
		}
	})
})
app.get("/",function(req,res){
	res.redirect("/home");
})
//new route
app.get("/home/new",function(req,res){
	res.render("new");
})
//post on home page
app.post("/home",function(req,res){
	
	req.body.subj.body = req.sanitize(req.body.subj.body);
	console.log(req.body.subj);
	subj.create(req.body.subj,function(err){
		if(err){
			res.render("/new");
		}else{
			res.redirect("/home");
		}
	})
})
//show
app.get("/home/:id",function(req,res){
		subj.findById(req.params.id,function(err,capturedId){
		if(err){	
				res.redirect("/home")
		}
		else{
			res.render("show", {Details:capturedId}); 
			
		}
	});

})
// edit routes bas jo edit karna hai vo dikhega same as show upar dekh
app.get("/home/:id/edit",function(req,res){
	subj.findById(req.params.id,function(err,capturedId){
		if(err){	
				res.redirect("/home")
		}
		else{
			res.render("edit", {Details:capturedId}); 
			
		}
	});
})

//update routes
app.put("/home/:id",function(req,res){
	// navi navi method hai for update
	// (id,new data ,callback)
	
	req.body.subj.body = req.sanitize(req.body.subj.body);
subj.findByIdAndUpdate(req.params.id,req.body.subj,function(err){
	console.log(req.body.Details);
	if(err){
		res.redirect("/home");
	}
		else{
			res.redirect("/home/"+req.params.id);
		}
	})
})

//delete routes
app.delete("/home/:id",function(req,res){
	
subj.findByIdAndRemove(req.params.id,function(err){
	if(err){
		res.redirect("/home");
	}else{
		res.redirect("/home");
	}
})
})




app.listen(process.env.PORT || 3000 ,process.env.IP,function(){
	console.log("server statted");
})