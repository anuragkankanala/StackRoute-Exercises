//Necessary Imports and Global Variables
var xmla = require("./xmla4js-master/src/Xmla.js"),
    url = require("url"),
    http = require("http"),
    port = 8080,
    fs = require("fs"),
    X=xmla.Xmla,
    discoverRequestTypes = [
        null,
        {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
        {name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG},
        {name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", property: X.PROP_CUBE},
        {name: X.MDSCHEMA_DIMENSIONS, key: "DIMENSION_UNIQUE_NAME"},
        {name: X.MDSCHEMA_HIERARCHIES, key: "HIERARCHY_UNIQUE_NAME"},
        {name: X.MDSCHEMA_LEVELS, key: "LEVEL_UNIQUE_NAME"},
        {name: X.MDSCHEMA_MEMBERS, key: "MEMBER_UNIQUE_NAME"},
        {name: X.MDSCHEMA_PROPERTIES}
    ];

function decodeFragments(fragments) {
    var decodedFragments = [], i, n = fragments.length;
    for (i = 0; i < n; i++) {
        decodedFragments.push(decodeURIComponent(fragments[i]));
    }
    return decodedFragments;
}

var requestURL1 = url.parse("http://localhost:8080/?url=http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password",true);


http.createServer(function(request,response){
  response.writeHead(200);

// //--------------------------------Get DataSourceInfo--------------------------------------------------------
//   var fragments = requestURL1.pathname.split("/"),
//       decodedFragments = decodeFragments(fragments),
//       numFragments = fragments.length,
//       properties = {},
//       restrictions = {},
//       discoverRequestType = discoverRequestTypes[numFragments];
//
//   var xmlaRequest1= {
//     async:true,
//     url:decodeURIComponent("http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password"),
//     success:function(xmla,xmlaRequest1,xmlaResponse) {
//       // response.write(JSON.stringify(xmlaResponse.fetchAllAsObject())+"\n");
//       response.write("Found DataSourceInfo.\n WriteFile DataSourceInfo.json\n");
//       var objTemp = JSON.stringify(xmlaResponse.fetchAllAsObject());
//       fs.writeFile("./json/DatasourceInfo.json",objTemp);
//       console.log(JSON.stringify(xmlaResponse.fetchAllAsObject()));
//     },
//     error : function() {
//       console.log("error finding DataSourceInfo!!!");
//       response.write("error finding DataSourceInfo!!!");
//     },
//     callback:function(){
//       //Calling CatalogName operations
//       var x2 = new xmla.Xmla();
//       x2.request(xmlaRequest2);
//   }
// }
//
// requestURL1.fragments = fragments;
// requestURL1.decodedFragments = decodedFragments;
//
//
//   //switch(numFragments) {
//     //case 2:
//         //check if we need to output datasoures or catalog metadata for a particular datasource
//         // if (fragments[1] !== "") {
//         //     properties[discoverRequestTypes[1].property] = decodedFragments[1];
//         //     xmlaRequest1.properties = properties;
//         // }
//         if (!xmlaRequest1.method) {
//             xmlaRequest1.method = X.METHOD_DISCOVER;
//             if (fragments[1] === "") {
//                 xmlaRequest1.requestType = X.DISCOVER_DATASOURCES;
//             }
//             else {
//                 xmlaRequest1.requestType = discoverRequestType.name;
//                 xmlaRequest1.restrictions = restrictions;
//             }
//         }
// //}
//
//   var x1 = new xmla.Xmla();
//   x1.request(xmlaRequest1);
//
//
// //---------------------------------------------Get Catalog Name-----------------------------------------------------------------------------
// var requestURL2 = url.parse("http://localhost:8080/Pentaho?url=http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password",true);
//     fragments = requestURL2.pathname.split("/");
//     decodedFragments = decodeFragments(fragments);
//     numFragments = fragments.length;
//     discoverRequestType = discoverRequestTypes[numFragments];
//
// var xmlaRequest2 = {
//   async:true,
//   url:decodeURIComponent("http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password"),
//   success:function(xmla,xmlaRequest2,xmlaResponse) {
//     var objTemp2 = JSON.stringify(xmlaResponse.fetchAllAsObject());
//     fs.writeFile("./json/CatalogInfo.json",objTemp2);
//     response.write("Found Catalog Info \n WriteFile CatalogInfo.json");
//
//   },
//   error : function() {
//     console.log("error!!!");
//     response.write("Error!!!");
//   },
//   callback:function(){
//     var x3 = new xmla.Xmla();
//     x3.request(xmlaRequest3);
// }
// }
// requestURL2.fragments = fragments;
// requestURL2.decodedFragments = decodedFragments;
//
//
//       //check if we need to output datasoures or catalog metadata for a particular datasource
//       switch (numFragments) {
//           case 8:
//               restrictions[discoverRequestTypes[7].key] = decodedFragments[7];
//           case 7:
//               restrictions[discoverRequestTypes[6].key] = decodedFragments[6];
//           case 6:
//               restrictions[discoverRequestTypes[5].key] = decodedFragments[5];
//           case 5:
//               restrictions[discoverRequestTypes[4].key] = decodedFragments[4];
//           case 4:
//               if (numFragments === 4) {
//                   //check if we need to output cube metadata or a mdx query result
//                   if (typeof(query.mdx) !== "undefined") {
//                       xmlaRequest2.method = X.METHOD_EXECUTE;
//                       xmlaRequest2.statement = query.mdx;
//                       properties[X.PROP_FORMAT] = query.resultformat || (contentType === "text/csv" ? Xmla.PROP_FORMAT_TABULAR : X.PROP_FORMAT_MULTIDIMENSIONAL)
//                   }
//               }
//               restrictions[discoverRequestTypes[3].key] = properties[discoverRequestTypes[3].property] = decodedFragments[3];
//           case 3:
//               restrictions[discoverRequestTypes[2].key] = properties[discoverRequestTypes[2].property] = decodedFragments[2];
//               xmlaRequest2.restrictions = restrictions;
//           case 2:
//               //check if we need to output datasoures or catalog metadata for a particular datasource
//               if (fragments[1] !== "") {
//                   properties[discoverRequestTypes[1].property] = decodedFragments[1];
//                   xmlaRequest2.properties = properties;
//               }
//               if (!xmlaRequest2.method) {
//                   xmlaRequest2.method = X.METHOD_DISCOVER;
//                   if (fragments[1] === "") {
//                       xmlaRequest2.requestType = X.DISCOVER_DATASOURCES;
//                   }
//                   else {
//                       xmlaRequest2.requestType = discoverRequestType.name;
//                       xmlaRequest2.restrictions = restrictions;
//                   }
//               }
//       }
//
//
// //-------------------------Get Cube Details----------------------------------------------------------------
//
// var requestURL3 = url.parse("http://localhost:8080/Pentaho/SampleData?url=http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password",true);
// fragments = requestURL3.pathname.split("/");
// decodedFragments = decodeFragments(fragments);
// numFragments = fragments.length;
// discoverRequestType = discoverRequestTypes[numFragments];
//
// var xmlaRequest3 = {
//   async:true,
//   url:decodeURIComponent("http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password"),
//   success:function(xmla,xmlaRequest3,xmlaResponse) {
//     var objTemp3 = JSON.stringify(xmlaResponse.fetchAllAsObject());
//     fs.writeFile("./json/CubeInfo.json",objTemp3);
//
//     console.log(xmlaResponse);
//   },
//   error : function() {
//     console.log("error!!!");
//     response.write("Error!!!");
//   },
//   callback:function(){
//     var x4 = new xmla.Xmla();
//     x4.request(xmlaRequest4);
//
// }
// }
// requestURL3.fragments = fragments;
// requestURL3.decodedFragments = decodedFragments;
//
// switch(numFragments) {
//   case 3:
//       restrictions[discoverRequestTypes[2].key] = properties[discoverRequestTypes[2].property] = decodedFragments[2];
//       xmlaRequest3.restrictions = restrictions;
//   case 2:
//       //check if we need to output datasoures or catalog metadata for a particular datasource
//       if (fragments[1] !== "") {
//           properties[discoverRequestTypes[1].property] = decodedFragments[1];
//           xmlaRequest3.properties = properties;
//       }
//       if (!xmlaRequest3.method) {
//           xmlaRequest3.method = X.METHOD_DISCOVER;
//           if (fragments[1] === "") {
//               xmlaRequest3.requestType = X.DISCOVER_DATASOURCES;
//           }
//           else {
//               xmlaRequest3.requestType = discoverRequestType.name;
//               xmlaRequest3.restrictions = restrictions;
//           }
//       }
// }

//---------------Get Dimensions--------------------------------------------------------------------------------
var requestURL4 = url.parse("http://localhost:8080/Pentaho/SampleData/Quadrant%20Analysis?url=http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password",true);
var query = requestURL4.query;
var fragments = requestURL4.pathname.split("/");
var decodedFragments = decodeFragments(fragments);
var numFragments = fragments.length;
var discoverRequestType = discoverRequestTypes[numFragments];
var restrictions ={};
var properties = {};

var xmlaRequest4 = {
  async:true,
  url:decodeURIComponent("http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password"),
  success:function(xmla,xmlaRequest4,xmlaResponse) {
    var objTemp4 = JSON.stringify(xmlaResponse.fetchAllAsObject());
    fs.writeFile("./json/DimensionsInfo.json",objTemp4);

    console.log(xmlaResponse);
  },
  error : function() {
    console.log("error!!!");
    response.write("Error!!!");
  },
  callback:function(){
    response.end();
}
}
requestURL4.fragments = fragments;
requestURL4.decodedFragments = decodedFragments;

switch(numFragments) {
  case 4:
      if (numFragments === 4) {
          //check if we need to output cube metadata or a mdx query result
          if (typeof(query.mdx) !== "undefined") {
              xmlaRequest4.method = X.METHOD_EXECUTE;
              xmlaRequest4.statement = query.mdx;
              properties[X.PROP_FORMAT] = query.resultformat || (contentType === "text/csv" ? Xmla.PROP_FORMAT_TABULAR : X.PROP_FORMAT_MULTIDIMENSIONAL)
          }
      }
      restrictions[discoverRequestTypes[3].key] = properties[discoverRequestTypes[3].property] = decodedFragments[3];
  case 3:
      restrictions[discoverRequestTypes[2].key] = properties[discoverRequestTypes[2].property] = decodedFragments[2];
      xmlaRequest4.restrictions = restrictions;
  case 2:
      //check if we need to output datasoures or catalog metadata for a particular datasource
      if (fragments[1] !== "") {
          properties[discoverRequestTypes[1].property] = decodedFragments[1];
          xmlaRequest4.properties = properties;
      }
      if (!xmlaRequest4.method) {
          xmlaRequest4.method = X.METHOD_DISCOVER;
          if (fragments[1] === "") {
              xmlaRequest4.requestType = X.DISCOVER_DATASOURCES;
          }
          else {
              xmlaRequest4.requestType = discoverRequestType.name;
              xmlaRequest4.restrictions = restrictions;
          }
      }
}

var x4 = new xmla.Xmla();
x4.request(xmlaRequest4);
}).listen(port);
