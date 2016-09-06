var express=require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var bs = require("binary-search");

var data = require('./data/data.json');

var app = express();



//configure app to use bodyParser()
//this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//middleware to use for all requests
var router = express.Router();
router.use(function(req,res,next){
	console.log(req.method+ ": "+ req.originalUrl);
	next();
});


//all of our routes will be prefixed with /api
app.use('/api', router);
   

//static resources
app.use(express.static('public'));

//Get items sorted
router.get('/items', function(req, res){
	res.json(sortItems(data.slice(0), req.query.sortedby, req.query.order=='descending'));
});

//Get item by Id
var dataSorted = sortItems(data.slice(0), "id", false);
router.get('/items/id/:id', function(req, res){
	var index=bs(dataSorted, req.params.id, function(a,b){
		return a.id==b?0:(a.id>b?1:-1);
	} );
	if(index<0){
		res.send("Unknown id.");
	}else{
		res.json(dataSorted[index]);
	}
});

//Get items by userId
var dataMap = Object.create(null);
for(var i=0; i<data.length; i++){
	if(dataMap[data[i].userId] === undefined){
		dataMap[data[i].userId] = [];
	}
	dataMap[data[i].userId].push(data[i]);
}
router.get('/items/userid/:userId', function(req,res){
	if(dataMap[req.params.userId] != undefined){
		res.json(dataMap[req.params.userId]);
	}else{
		res.send("Unknown user id");
	}
	
});

//Get items within range
router.get('/items/geo', function(req,res){
	var items = [];
	for(var i=0; i<data.length; i++){
	  var d = distance(req.query.lat, req.query.long, data[i].loc[0], data[i].loc[1]);
	  if(d<=req.query.distance){
		  items.push(data[i]);
	  }
	}
	res.json(items);
	
	
});


function sortItems(data, sortedBy, descending){	
	data.sort(function(a, b){		
		var am, bm;
		if(sortedBy=="createdDate"){
		am = Date.parse(a.createdAt);
	    bm = Date.parse(b.createdAt);
		}else if(sortedBy=="price"){
			am=a.price;
			bm=b.price;
		}else if(sortedBy == "id"){
			am = a.id;
			bm=b.id;
		}else{
			throw "Unknown sortedBy: " + sortedBy;
		}
	    if(am==bm){
	    	return 0;
	    }
		if(am>bm){
			return descending? -1:1;
		}else{
			return descending? 1:-1;
		}
	});
	return data;
}

function distance(lat1, lon1, lat2, lon2) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	return dist
}

//set our port
var port = process.env.PORT || 8080;     

//start server
app.listen(port, function(){
	console.log('close5app started on port ' + port + "!");
});
