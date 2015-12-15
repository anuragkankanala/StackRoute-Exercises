//Importing necessary Imports
var http = require("http");
var express = require("express");
var cookiePareser = require("cookie-parser");
var xmla = require("./xmla4js-master/src/Xmla.js");
var url = require("url");
var xmlaRequest = {};

//Create an instance of Express
var app = new express();

//Necessary Middleware
//app.use(cookieParser());
app.use(express.Router());

//Function Declarations
function urlBuilder(host,pathName,query) {
   return url.parse(host+pathName+"?url="+query,true);
}

function decodeFragments(fragments) {
	var decodedFragments = [], i, n = fragments.length;
	for (i = 0; i < n; i++) {
  		decodedFragments.push(decodeURIComponent(fragments[i]));
	}
	return decodedFragments;
}

//1. Route for Discovering Data Source Name
app.get("/getDataSourceName",function(req,res){
	var X = xmla.Xmla;
	var returnObj = {};
	var xmlaServer = "http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password";
	var pathName = "/";
   var hostAddress = "http://localhost:8080";

   var discoverRequestTypes = [
    	null,
    	{name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO}
   ];

	var requestURL = urlBuilder(hostAddress,pathName,xmlaServer);

	var fragments = requestURL.pathname.split("/"),
		decodedFragments = decodeFragments(fragments),
		numFragments = fragments.length,
		properties = {},
		restrictions = {},
		discoverRequestType = discoverRequestTypes[numFragments];

	xmlaRequest = {
		async : true,
		url : decodeURIComponent(xmlaServer),
		success : function(xmla,xmlaRequest,xmlaResponse) {
			temp = JSON.stringify(xmlaResponse.fetchAllAsObject(),null,2);
			var returnObj = JSON.parse(temp);

			res.write(returnObj[0].DataSourceName);
			res.end();
		},
		error : function() {
			res.write("Error finding Data source Name");
		}
	}

	requestURL.fragments = fragments;
	requestURL.decodedFragments = decodedFragments;

	if (!xmlaRequest.method) {
        xmlaRequest.method = X.METHOD_DISCOVER;
        if (fragments[1] === "") {
            xmlaRequest.requestType = X.DISCOVER_DATASOURCES;
        }
        else {
            xmlaRequest.requestType = discoverRequestType.name;
            xmlaRequest.restrictions = restrictions;
        }
    }
      var x = new xmla.Xmla();
    		x.request(xmlaRequest);

});

//2. Route for Catalog Name
app.get('/getCatalogName',function(req,res){
	var X = xmla.Xmla;
	var returnObj = {};
	var xmlaServer = "http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password";
	var pathName = "/Pentaho";
   var hostAddress = "http://localhost:8080";

	var discoverRequestTypes = [
	  	null,
	   {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
	   {name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG}
	];

	var requestURL = urlBuilder(hostAddress,pathName,xmlaServer);

	var fragments = requestURL.pathname.split("/"),
		decodedFragments = decodeFragments(fragments),
		numFragments = fragments.length,
		properties = {},
		restrictions = {},
		discoverRequestType = discoverRequestTypes[numFragments];

   var xmlaRequest = {
  		async:true,
  		url:decodeURIComponent(xmlaServer),
  		success:function(xmla,xmlaRequest,xmlaResponse) {
    		var temp = JSON.stringify(xmlaResponse.fetchAllAsObject(),null,2);
    		returnObj = JSON.parse(temp);
    		res.write(returnObj[0].CATALOG_NAME);
    		res.end();
  		},
  		error:function(){
    		res.write("Error finding the DataSourceName");

  		},
  		callback:function() {
    		res.end();
  		}
  	}

  	requestURL.fragments = fragments;
  	requestURL.decodedFragments = decodedFragments;

	//check if we need to output datasoures or catalog metadata for a particular datasource
	if (fragments[1] !== "") {
	  properties[discoverRequestTypes[1].property] = decodedFragments[1];
	  xmlaRequest.properties = properties;
	}
	if (!xmlaRequest.method) {
	  xmlaRequest.method = X.METHOD_DISCOVER;
	  if (fragments[1] === "") {
	      xmlaRequest.requestType = X.DISCOVER_DATASOURCES;
	  }
	  else {
	      xmlaRequest.requestType = discoverRequestType.name;
	      xmlaRequest.restrictions = restrictions;
	  }
	}

	var x = new xmla.Xmla;
	x.request(xmlaRequest);


	
});

//3.Route for Cube Name
app.get('/getCubeName',function(req,res){
	var X = xmla.Xmla;
	var returnObj = {};
	var xmlaServer = "http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password";
	var pathName = "/Pentaho/SampleData";
   var hostAddress = "http://localhost:8080";

	var discoverRequestTypes = [
	  	null,
	   {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
	   {name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG},
	   {name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", property: X.PROP_CUBE}
	];

	var requestURL = urlBuilder(hostAddress,pathName,xmlaServer);

	var fragments = requestURL.pathname.split("/"),
		decodedFragments = decodeFragments(fragments),
		numFragments = fragments.length,
		properties = {},
		restrictions = {},
		discoverRequestType = discoverRequestTypes[numFragments];

   var xmlaRequest = {
  		async:true,
  		url:decodeURIComponent(xmlaServer),
  		success:function(xmla,xmlaRequest,xmlaResponse) {
    		var temp = JSON.stringify(xmlaResponse.fetchAllAsObject(),null,2);
    		returnObj = JSON.parse(temp);
    		res.write(returnObj[0].CUBE_NAME);
    		res.end();
  		},
  		error:function(){
    		res.write("Error finding the DataSourceName");

  		},
  		callback:function() {
    		res.end();
  		}
  	}

  	requestURL.fragments = fragments;
  	requestURL.decodedFragments = decodedFragments;

  	switch(numFragments) {
  		case 3 :
  			restrictions[discoverRequestTypes[2].key] = properties[discoverRequestTypes[2].property] = decodedFragments[2];
  			xmlaRequest.restrictions = restrictions;

  		case 2 :
  			//check if we need to output datasoures or catalog metadata for a particular datasource
          if (fragments[1] !== "") {
              properties[discoverRequestTypes[1].property] = decodedFragments[1];
              xmlaRequest.properties = properties;
          }
          if (!xmlaRequest.method) {
              xmlaRequest.method = X.METHOD_DISCOVER;
              if (fragments[1] === "") {
                  xmlaRequest.requestType = X.DISCOVER_DATASOURCES;
              }
              else {
                  xmlaRequest.requestType = discoverRequestType.name;
                  xmlaRequest.restrictions = restrictions;
              }
          }
  	}

	var x = new xmla.Xmla;
	x.request(xmlaRequest);


	
});

//4. Discover Dimensions
app.get('/getDimensions',function(req,res){
	var X = xmla.Xmla;
	var returnObj = {};
	var xmlaServer = "http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password";
	var pathName = "/Pentaho/SampleData/Quadrant Analysis";
   var hostAddress = "http://localhost:8080";

	var discoverRequestTypes = [
	  	null,
	   {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
	   {name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG},
	   {name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", property: X.PROP_CUBE},
	   {name: X.MDSCHEMA_DIMENSIONS, key: "DIMENSION_UNIQUE_NAME"}
	];

	var requestURL = urlBuilder(hostAddress,pathName,xmlaServer);
	var query = requestURL.query;

	var fragments = requestURL.pathname.split("/"),
		decodedFragments = decodeFragments(fragments),
		numFragments = fragments.length,
		properties = {},
		restrictions = {},
		discoverRequestType = discoverRequestTypes[numFragments];

   var xmlaRequest = {
  		async:true,
  		url:decodeURIComponent(xmlaServer),
  		success:function(xmla,xmlaRequest,xmlaResponse) {
    		var temp = JSON.stringify(xmlaResponse.fetchAllAsObject(),null,2);
    		returnObj = JSON.parse(temp);
    		res.write(temp);
    		res.end();
  		},
  		error:function(){
    		res.write("Error finding the DataSourceName");

  		},
  		callback:function() {
    		res.end();
  		}
  	}

  	requestURL.fragments = fragments;
  	requestURL.decodedFragments = decodedFragments;

  	switch(numFragments) {
  		case 4:
          if (numFragments === 4) {
              //check if we need to output cube metadata or a mdx query result
              if (typeof(query.mdx) !== "undefined") {
                  xmlaRequest.method = X.METHOD_EXECUTE;
                  xmlaRequest.statement = query.mdx;
                  properties[X.PROP_FORMAT] = query.resultformat || (contentType === "text/csv" ? Xmla.PROP_FORMAT_TABULAR : X.PROP_FORMAT_MULTIDIMENSIONAL)
              }
          }
          restrictions[discoverRequestTypes[3].key] = properties[discoverRequestTypes[3].property] = decodedFragments[3];
  		case 3 :
  			restrictions[discoverRequestTypes[2].key] = properties[discoverRequestTypes[2].property] = decodedFragments[2];
  			xmlaRequest.restrictions = restrictions;

  		case 2 :
  			//check if we need to output datasoures or catalog metadata for a particular datasource
          if (fragments[1] !== "") {
              properties[discoverRequestTypes[1].property] = decodedFragments[1];
              xmlaRequest.properties = properties;
          }
          if (!xmlaRequest.method) {
              xmlaRequest.method = X.METHOD_DISCOVER;
              if (fragments[1] === "") {
                  xmlaRequest.requestType = X.DISCOVER_DATASOURCES;
              }
              else {
                  xmlaRequest.requestType = discoverRequestType.name;
                  xmlaRequest.restrictions = restrictions;
              }
          }
  	}

	var x = new xmla.Xmla;
	x.request(xmlaRequest);


	
});

//5.Discover Hierarchies
app.get('/getHierarchy',function(req,res){
	var X = xmla.Xmla;
	var returnObj = {};
	var xmlaServer = "http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password";
	var pathName = "/Pentaho/SampleData/Quadrant Analysis/[Department]";
   var hostAddress = "http://localhost:8080";

	var discoverRequestTypes = [
	  	null,
	   {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
	   {name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG},
	   {name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", property: X.PROP_CUBE},
	   {name: X.MDSCHEMA_DIMENSIONS, key: "DIMENSION_UNIQUE_NAME"},
	   {name: X.MDSCHEMA_HIERARCHIES, key: "HIERARCHY_UNIQUE_NAME"}
	];

	var requestURL = urlBuilder(hostAddress,pathName,xmlaServer);
	var query = requestURL.query;

	var fragments = requestURL.pathname.split("/"),
		decodedFragments = decodeFragments(fragments),
		numFragments = fragments.length,
		properties = {},
		restrictions = {},
		discoverRequestType = discoverRequestTypes[numFragments];

   var xmlaRequest = {
  		async:true,
  		url:decodeURIComponent(xmlaServer),
  		success:function(xmla,xmlaRequest,xmlaResponse) {
    		var temp = JSON.stringify(xmlaResponse.fetchAllAsObject(),null,2);
    		returnObj = JSON.parse(temp);
    		res.write(temp);
    		res.end();
  		},
  		error:function(){
    		res.write("Error finding the DataSourceName");

  		},
  		callback:function() {
    		res.end();
  		}
  	}

  	requestURL.fragments = fragments;
  	requestURL.decodedFragments = decodedFragments;

  	switch(numFragments) {
  		case 5:
          restrictions[discoverRequestTypes[4].key] = decodedFragments[4];

  		case 4:
          if (numFragments === 4) {
              //check if we need to output cube metadata or a mdx query result
              if (typeof(query.mdx) !== "undefined") {
                  xmlaRequest.method = X.METHOD_EXECUTE;
                  xmlaRequest.statement = query.mdx;
                  properties[X.PROP_FORMAT] = query.resultformat || (contentType === "text/csv" ? Xmla.PROP_FORMAT_TABULAR : X.PROP_FORMAT_MULTIDIMENSIONAL)
              }
          }
          restrictions[discoverRequestTypes[3].key] = properties[discoverRequestTypes[3].property] = decodedFragments[3];
  		case 3 :
  			restrictions[discoverRequestTypes[2].key] = properties[discoverRequestTypes[2].property] = decodedFragments[2];
  			xmlaRequest.restrictions = restrictions;

  		case 2 :
  			//check if we need to output datasoures or catalog metadata for a particular datasource
          if (fragments[1] !== "") {
              properties[discoverRequestTypes[1].property] = decodedFragments[1];
              xmlaRequest.properties = properties;
          }
          if (!xmlaRequest.method) {
              xmlaRequest.method = X.METHOD_DISCOVER;
              if (fragments[1] === "") {
                  xmlaRequest.requestType = X.DISCOVER_DATASOURCES;
              }
              else {
                  xmlaRequest.requestType = discoverRequestType.name;
                  xmlaRequest.restrictions = restrictions;
              }
          }
  	}

	var x = new xmla.Xmla;
	x.request(xmlaRequest);
	
});

//6. Discover Levels
app.get('/getLevels',function(req,res){
	var X = xmla.Xmla;
	var returnObj = {};
	var xmlaServer = "http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password";
	var pathName = "/Pentaho/SampleData/Quadrant Analysis/[Department]/[Department]";
   var hostAddress = "http://localhost:8080";

	var discoverRequestTypes = [
	  	null,
	   {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
	   {name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG},
	   {name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", property: X.PROP_CUBE},
	   {name: X.MDSCHEMA_DIMENSIONS, key: "DIMENSION_UNIQUE_NAME"},
	   {name: X.MDSCHEMA_HIERARCHIES, key: "HIERARCHY_UNIQUE_NAME"},
	   {name: X.MDSCHEMA_LEVELS, key: "LEVEL_UNIQUE_NAME"}
	];

	var requestURL = urlBuilder(hostAddress,pathName,xmlaServer);
	var query = requestURL.query;

	var fragments = requestURL.pathname.split("/"),
		decodedFragments = decodeFragments(fragments),
		numFragments = fragments.length,
		properties = {},
		restrictions = {},
		discoverRequestType = discoverRequestTypes[numFragments];

   var xmlaRequest = {
  		async:true,
  		url:decodeURIComponent(xmlaServer),
  		success:function(xmla,xmlaRequest,xmlaResponse) {
    		var temp = JSON.stringify(xmlaResponse.fetchAllAsObject(),null,2);
    		returnObj = JSON.parse(temp);
    		res.write(returnObj[1].LEVEL_UNIQUE_NAME);
    		res.end();
  		},
  		error:function(){
    		res.write("Error finding the DataSourceName");

  		},
  		callback:function() {
    		res.end();
  		}
  	}

  	requestURL.fragments = fragments;
  	requestURL.decodedFragments = decodedFragments;

  	switch(numFragments) {
  		case 6:
          restrictions[discoverRequestTypes[5].key] = decodedFragments[5];

  		case 5:
          restrictions[discoverRequestTypes[4].key] = decodedFragments[4];

  		case 4:
          if (numFragments === 4) {
              //check if we need to output cube metadata or a mdx query result
              if (typeof(query.mdx) !== "undefined") {
                  xmlaRequest.method = X.METHOD_EXECUTE;
                  xmlaRequest.statement = query.mdx;
                  properties[X.PROP_FORMAT] = query.resultformat || (contentType === "text/csv" ? Xmla.PROP_FORMAT_TABULAR : X.PROP_FORMAT_MULTIDIMENSIONAL)
              }
          }
          restrictions[discoverRequestTypes[3].key] = properties[discoverRequestTypes[3].property] = decodedFragments[3];
  		case 3 :
  			restrictions[discoverRequestTypes[2].key] = properties[discoverRequestTypes[2].property] = decodedFragments[2];
  			xmlaRequest.restrictions = restrictions;

  		case 2 :
  			//check if we need to output datasoures or catalog metadata for a particular datasource
          if (fragments[1] !== "") {
              properties[discoverRequestTypes[1].property] = decodedFragments[1];
              xmlaRequest.properties = properties;
          }
          if (!xmlaRequest.method) {
              xmlaRequest.method = X.METHOD_DISCOVER;
              if (fragments[1] === "") {
                  xmlaRequest.requestType = X.DISCOVER_DATASOURCES;
              }
              else {
                  xmlaRequest.requestType = discoverRequestType.name;
                  xmlaRequest.restrictions = restrictions;
              }
          }
  	}

	var x = new xmla.Xmla;
	x.request(xmlaRequest);
	
});

//7. Discover Memebers
app.get('/getMembers',function(req,res){
	var X = xmla.Xmla;
	var returnObj = {};
	var xmlaServer = "http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password";
	var pathName = "/Pentaho/SampleData/Quadrant Analysis/[Department]/[Department]/[Department].[Department]";
   var hostAddress = "http://localhost:8080";

	var discoverRequestTypes = [
	  	null,
	   {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
	   {name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG},
	   {name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", property: X.PROP_CUBE},
	   {name: X.MDSCHEMA_DIMENSIONS, key: "DIMENSION_UNIQUE_NAME"},
	   {name: X.MDSCHEMA_HIERARCHIES, key: "HIERARCHY_UNIQUE_NAME"},
	   {name: X.MDSCHEMA_LEVELS, key: "LEVEL_UNIQUE_NAME"},
	   {name: X.MDSCHEMA_MEMBERS, key: "MEMBER_UNIQUE_NAME"}
	];

	var requestURL = urlBuilder(hostAddress,pathName,xmlaServer);
	var query = requestURL.query;

	var fragments = requestURL.pathname.split("/"),
		decodedFragments = decodeFragments(fragments),
		numFragments = fragments.length,
		properties = {},
		restrictions = {},
		discoverRequestType = discoverRequestTypes[numFragments];

   var xmlaRequest = {
  		async:true,
  		url:decodeURIComponent(xmlaServer),
  		success:function(xmla,xmlaRequest,xmlaResponse) {
    		var temp = JSON.stringify(xmlaResponse.fetchAllAsObject(),null,2);
    		returnObj = JSON.parse(temp);
    		res.write(returnObj[2].MEMBER_UNIQUE_NAME);
    		res.end();
  		},
  		error:function(){
    		res.write("Error finding the DataSourceName");

  		},
  		callback:function() {
    		res.end();
  		}
  	}

  	requestURL.fragments = fragments;
  	requestURL.decodedFragments = decodedFragments;

  	switch(numFragments) {
  		case 7:
          restrictions[discoverRequestTypes[6].key] = decodedFragments[6];

  		case 6:
          restrictions[discoverRequestTypes[5].key] = decodedFragments[5];

  		case 5:
          restrictions[discoverRequestTypes[4].key] = decodedFragments[4];

  		case 4:
          if (numFragments === 4) {
              //check if we need to output cube metadata or a mdx query result
              if (typeof(query.mdx) !== "undefined") {
                  xmlaRequest.method = X.METHOD_EXECUTE;
                  xmlaRequest.statement = query.mdx;
                  properties[X.PROP_FORMAT] = query.resultformat || (contentType === "text/csv" ? Xmla.PROP_FORMAT_TABULAR : X.PROP_FORMAT_MULTIDIMENSIONAL)
              }
          }
          restrictions[discoverRequestTypes[3].key] = properties[discoverRequestTypes[3].property] = decodedFragments[3];
  		case 3 :
  			restrictions[discoverRequestTypes[2].key] = properties[discoverRequestTypes[2].property] = decodedFragments[2];
  			xmlaRequest.restrictions = restrictions;

  		case 2 :
  			//check if we need to output datasoures or catalog metadata for a particular datasource
          if (fragments[1] !== "") {
              properties[discoverRequestTypes[1].property] = decodedFragments[1];
              xmlaRequest.properties = properties;
          }
          if (!xmlaRequest.method) {
              xmlaRequest.method = X.METHOD_DISCOVER;
              if (fragments[1] === "") {
                  xmlaRequest.requestType = X.DISCOVER_DATASOURCES;
              }
              else {
                  xmlaRequest.requestType = discoverRequestType.name;
                  xmlaRequest.restrictions = restrictions;
              }
          }
  	}

	var x = new xmla.Xmla;
	x.request(xmlaRequest);
	
});

//Start the server
http.createServer(app).listen(8080, function() {
  console.log('Express app started');
});