//Global Variables and required Imports
var fs = require("fs");
var xmla = require("./xmla4js-master/src/Xmla.js");
var url = require("url");
var http = require("http");
var port = 8080;

//---------------1. Discover Data Source Name - (Pentaho)-------------------------------------------
function discoverDataSourceName(options) {

    var X = xmla.Xmla;
    var returnObj = {};

    var xmlaServer = options.xmlaServer;
    var pathName = options.pathName;
    var hostAddress = options.hostAddress;

    function urlBuilder(host,pathName,query) {
      return url.parse(host+pathName+"?url="+query,true);
    }

    var discoverRequestTypes = [
        null,
        {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
        //{name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG},
        // {name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", property: X.PROP_CUBE},
        // {name: X.MDSCHEMA_DIMENSIONS, key: "DIMENSION_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_HIERARCHIES, key: "HIERARCHY_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_LEVELS, key: "LEVEL_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_MEMBERS, key: "MEMBER_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_PROPERTIES}
    ];

    function decodeFragments(fragments) {
        var decodedFragments = [], i, n = fragments.length;
        for (i = 0; i < n; i++) {
            decodedFragments.push(decodeURIComponent(fragments[i]));
        }
        return decodedFragments;
    }

    var requestURL = urlBuilder(hostAddress,pathName,xmlaServer);

  var server =  http.createServer(function(request,response) {
      response.writeHead(200);

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
          returnObj = JSON.stringify(xmlaResponse.fetchAllAsObject(),null,2);
          fs.writeFile("./json/DataSourceName.json",returnObj);
        },
        error:function(){
          response.write("Error finding the DataSourceName");

        },
        callback:function() {
          response.end();
          server.close();
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
  }).listen(port);

}

//---------------2. Discover Catalog Name----------------------------------------------------------------------
function discoverCatalogName(options) {

    var X = xmla.Xmla;
    var returnObj = {};

    var xmlaServer = options.xmlaServer;
    var pathName = options.pathName;
    var hostAddress = options.hostAddress;

    function urlBuilder(host,pathName,query) {
      return url.parse(host+pathName+"?url="+query,true);
    }

    var discoverRequestTypes = [
        null,
        {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
        {name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG}
        // {name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", property: X.PROP_CUBE},
        // {name: X.MDSCHEMA_DIMENSIONS, key: "DIMENSION_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_HIERARCHIES, key: "HIERARCHY_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_LEVELS, key: "LEVEL_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_MEMBERS, key: "MEMBER_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_PROPERTIES}
    ];

    function decodeFragments(fragments) {
        var decodedFragments = [], i, n = fragments.length;
        for (i = 0; i < n; i++) {
            decodedFragments.push(decodeURIComponent(fragments[i]));
        }
        return decodedFragments;
    }

    var requestURL = urlBuilder(hostAddress,pathName,xmlaServer);

  var server =  http.createServer(function(request,response) {
      response.writeHead(200);

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
          returnObj = JSON.stringify(xmlaResponse.fetchAllAsObject(),null,2);
          response.write(returnObj);
          fs.writeFile("./json/DataCatalogName.json",returnObj);
          server.close();
        },
        error:function(){
          response.write("Error finding the DataSourceName");

        },
        callback:function() {
          response.end();

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

    var x = new xmla.Xmla();
    x.request(xmlaRequest);
  }).listen(port);

}

//-----------------------3. Discover Cube Name----------------------------------------------------------------------
function discoverCubeName(options) {

    var X = xmla.Xmla;
    var returnObj = {};

    var xmlaServer = options.xmlaServer;
    var pathName = options.pathName;
    var hostAddress = options.hostAddress;

    function urlBuilder(host,pathName,query) {
      return url.parse(host+pathName+"?url="+query,true);
    }

    var discoverRequestTypes = [
        null,
        {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
        {name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG},
        {name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", property: X.PROP_CUBE},
        // {name: X.MDSCHEMA_DIMENSIONS, key: "DIMENSION_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_HIERARCHIES, key: "HIERARCHY_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_LEVELS, key: "LEVEL_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_MEMBERS, key: "MEMBER_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_PROPERTIES}
    ];

    function decodeFragments(fragments) {
        var decodedFragments = [], i, n = fragments.length;
        for (i = 0; i < n; i++) {
            decodedFragments.push(decodeURIComponent(fragments[i]));
        }
        return decodedFragments;
    }

    var requestURL = urlBuilder(hostAddress,pathName,xmlaServer);

    http.createServer(function(request,response) {
      response.writeHead(200);

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
          returnObj = JSON.stringify(xmlaResponse.fetchAllAsObject(),null,2);
          response.write(returnObj);
          fs.writeFile("./json/CubeName.json",returnObj);
        },
        error:function(){
          response.write("Error finding the cube details");

        },
        callback:function() {
          response.end();
        }
      }

    requestURL.fragments = fragments;
    requestURL.decodedFragments = decodedFragments;

  switch (numFragments) {
      // case 8:
      //     restrictions[discoverRequestTypes[7].key] = decodedFragments[7];
      // case 7:
      //     restrictions[discoverRequestTypes[6].key] = decodedFragments[6];
      // case 6:
      //     restrictions[discoverRequestTypes[5].key] = decodedFragments[5];
      // case 5:
      //     restrictions[discoverRequestTypes[4].key] = decodedFragments[4];
      // case 4:
      //     if (numFragments === 4) {
      //         //check if we need to output cube metadata or a mdx query result
      //         if (typeof(query.mdx) !== "undefined") {
      //             xmlaRequest.method = X.METHOD_EXECUTE;
      //             xmlaRequest.statement = query.mdx;
      //             properties[X.PROP_FORMAT] = query.resultformat || (contentType === "text/csv" ? Xmla.PROP_FORMAT_TABULAR : X.PROP_FORMAT_MULTIDIMENSIONAL)
      //         }
      //     }
      //     restrictions[discoverRequestTypes[3].key] = properties[discoverRequestTypes[3].property] = decodedFragments[3];
      case 3:
          restrictions[discoverRequestTypes[2].key] = properties[discoverRequestTypes[2].property] = decodedFragments[2];
          xmlaRequest.restrictions = restrictions;
      case 2:
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

    var x = new xmla.Xmla();
    x.request(xmlaRequest);
  }).listen(port);

}

//--------------------------4. Discover Dimesnions-------------------------------------------------------------------
function discoverDimensions(options) {

    var X = xmla.Xmla;
    var returnObj = {};

    var xmlaServer = options.xmlaServer;
    var pathName = options.pathName;
    var hostAddress = options.hostAddress;

    function urlBuilder(host,pathName,query) {
      return url.parse(host+pathName+"?url="+query,true);
    }

    var discoverRequestTypes = [
        null,
        {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
        {name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG},
        {name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", property: X.PROP_CUBE},
        {name: X.MDSCHEMA_DIMENSIONS, key: "DIMENSION_UNIQUE_NAME"}
        // {name: X.MDSCHEMA_HIERARCHIES, key: "HIERARCHY_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_LEVELS, key: "LEVEL_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_MEMBERS, key: "MEMBER_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_PROPERTIES}
    ];

    function decodeFragments(fragments) {
        var decodedFragments = [], i, n = fragments.length;
        for (i = 0; i < n; i++) {
            decodedFragments.push(decodeURIComponent(fragments[i]));
        }
        return decodedFragments;
    }

    var requestURL = urlBuilder(hostAddress,pathName,xmlaServer);
    var query = requestURL.query;

    http.createServer(function(request,response) {
      response.writeHead(200);

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
          returnObj = JSON.stringify(xmlaResponse.fetchAllAsObject(),null,2);
          response.write(returnObj);
          fs.writeFile("./json/Dimensions.json",returnObj);
        },
        error:function(){
          response.write("Error finding the Dimensions details");

        },
        callback:function() {
          response.end();
        }
      }

    requestURL.fragments = fragments;
    requestURL.decodedFragments = decodedFragments;

  switch (numFragments) {
      // case 8:
      //     restrictions[discoverRequestTypes[7].key] = decodedFragments[7];
      // case 7:
      //     restrictions[discoverRequestTypes[6].key] = decodedFragments[6];
      // case 6:
      //     restrictions[discoverRequestTypes[5].key] = decodedFragments[5];
      // case 5:
      //     restrictions[discoverRequestTypes[4].key] = decodedFragments[4];
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
      case 3:
          restrictions[discoverRequestTypes[2].key] = properties[discoverRequestTypes[2].property] = decodedFragments[2];
          xmlaRequest.restrictions = restrictions;
      case 2:
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

    var x = new xmla.Xmla();
    x.request(xmlaRequest);
  }).listen(port);

}

//---------------------5.Discover Hierarchy------------------------------------------------------------------------
function discoverHierarchies(options) {

    var X = xmla.Xmla;
    var returnObj = {};

    var xmlaServer = options.xmlaServer;
    var pathName = options.pathName;
    var hostAddress = options.hostAddress;

    function urlBuilder(host,pathName,query) {
      return url.parse(host+pathName+"?url="+query,true);
    }

    var discoverRequestTypes = [
        null,
        {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
        {name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG},
        {name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", property: X.PROP_CUBE},
        {name: X.MDSCHEMA_DIMENSIONS, key: "DIMENSION_UNIQUE_NAME"},
        {name: X.MDSCHEMA_HIERARCHIES, key: "HIERARCHY_UNIQUE_NAME"}
        // {name: X.MDSCHEMA_LEVELS, key: "LEVEL_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_MEMBERS, key: "MEMBER_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_PROPERTIES}
    ];

    function decodeFragments(fragments) {
        var decodedFragments = [], i, n = fragments.length;
        for (i = 0; i < n; i++) {
            decodedFragments.push(decodeURIComponent(fragments[i]));
        }
        return decodedFragments;
    }

    var requestURL = urlBuilder(hostAddress,pathName,xmlaServer);
    var query = requestURL.query;

    http.createServer(function(request,response) {
      response.writeHead(200);

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
          returnObj = JSON.stringify(xmlaResponse.fetchAllAsObject(),null,2);
          response.write(returnObj);
          fs.writeFile("./json/Hierarchy.json",returnObj);
        },
        error:function(){
          response.write("Error finding the Dimensions details");

        },
        callback:function() {
          response.end();
        }
      }

    requestURL.fragments = fragments;
    requestURL.decodedFragments = decodedFragments;

  switch (numFragments) {
      // case 8:
      //     restrictions[discoverRequestTypes[7].key] = decodedFragments[7];
      // case 7:
      //     restrictions[discoverRequestTypes[6].key] = decodedFragments[6];
      // case 6:
      //     restrictions[discoverRequestTypes[5].key] = decodedFragments[5];
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
      case 3:
          restrictions[discoverRequestTypes[2].key] = properties[discoverRequestTypes[2].property] = decodedFragments[2];
          xmlaRequest.restrictions = restrictions;
      case 2:
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

    var x = new xmla.Xmla();
    x.request(xmlaRequest);
  }).listen(port);

}

//--------------------6. Discover Levels-------------------------------------------------------------------------------
function discoverLevels(options) {

    var X = xmla.Xmla;
    var returnObj = {};

    var xmlaServer = options.xmlaServer;
    var pathName = options.pathName;
    var hostAddress = options.hostAddress;

    function urlBuilder(host,pathName,query) {
      return url.parse(host+pathName+"?url="+query,true);
    }

    var discoverRequestTypes = [
        null,
        {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
        {name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG},
        {name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", property: X.PROP_CUBE},
        {name: X.MDSCHEMA_DIMENSIONS, key: "DIMENSION_UNIQUE_NAME"},
        {name: X.MDSCHEMA_HIERARCHIES, key: "HIERARCHY_UNIQUE_NAME"},
        {name: X.MDSCHEMA_LEVELS, key: "LEVEL_UNIQUE_NAME"}
        // {name: X.MDSCHEMA_MEMBERS, key: "MEMBER_UNIQUE_NAME"},
        // {name: X.MDSCHEMA_PROPERTIES}
    ];

    function decodeFragments(fragments) {
        var decodedFragments = [], i, n = fragments.length;
        for (i = 0; i < n; i++) {
            decodedFragments.push(decodeURIComponent(fragments[i]));
        }
        return decodedFragments;
    }

    var requestURL = urlBuilder(hostAddress,pathName,xmlaServer);
    var query = requestURL.query;

    http.createServer(function(request,response) {
      response.writeHead(200);

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
          returnObj = JSON.stringify(xmlaResponse.fetchAllAsObject(),null,2);
          response.write(returnObj);
          fs.writeFile("./json/Levels.json",returnObj);
        },
        error:function(){
          response.write("Error finding the Levels details");

        },
        callback:function() {
          response.end();
        }
      }

    requestURL.fragments = fragments;
    requestURL.decodedFragments = decodedFragments;

  switch (numFragments) {
      // case 8:
      //     restrictions[discoverRequestTypes[7].key] = decodedFragments[7];
      // case 7:
      //     restrictions[discoverRequestTypes[6].key] = decodedFragments[6];
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
      case 3:
          restrictions[discoverRequestTypes[2].key] = properties[discoverRequestTypes[2].property] = decodedFragments[2];
          xmlaRequest.restrictions = restrictions;
      case 2:
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

    var x = new xmla.Xmla();
    x.request(xmlaRequest);
  }).listen(port);

}
//--------------------------7. Discover Members----------------------------------------------------------------------
function discoverMembers(options) {

    var X = xmla.Xmla;
    var returnObj = {};

    var xmlaServer = options.xmlaServer;
    var pathName = options.pathName;
    var hostAddress = options.hostAddress;

    function urlBuilder(host,pathName,query) {
      return url.parse(host+pathName+"?url="+query,true);
    }

    var discoverRequestTypes = [
        null,
        {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
        {name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG},
        {name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", property: X.PROP_CUBE},
        {name: X.MDSCHEMA_DIMENSIONS, key: "DIMENSION_UNIQUE_NAME"},
        {name: X.MDSCHEMA_HIERARCHIES, key: "HIERARCHY_UNIQUE_NAME"},
        {name: X.MDSCHEMA_LEVELS, key: "LEVEL_UNIQUE_NAME"},
        {name: X.MDSCHEMA_MEMBERS, key: "MEMBER_UNIQUE_NAME"}
        // {name: X.MDSCHEMA_PROPERTIES}
    ];

    function decodeFragments(fragments) {
        var decodedFragments = [], i, n = fragments.length;
        for (i = 0; i < n; i++) {
            decodedFragments.push(decodeURIComponent(fragments[i]));
        }
        return decodedFragments;
    }

    var requestURL = urlBuilder(hostAddress,pathName,xmlaServer);
    var query = requestURL.query;

    http.createServer(function(request,response) {
      response.writeHead(200);

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
          returnObj = JSON.stringify(xmlaResponse.fetchAllAsObject(),null,2);
          response.write(returnObj);
          fs.writeFile("./json/Members.json",returnObj);
        },
        error:function(){
          response.write("Error finding the Member details");

        },
        callback:function() {
          response.end();
        }
      }

    requestURL.fragments = fragments;
    requestURL.decodedFragments = decodedFragments;

  switch (numFragments) {
      // case 8:
      //     restrictions[discoverRequestTypes[7].key] = decodedFragments[7];
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
      case 3:
          restrictions[discoverRequestTypes[2].key] = properties[discoverRequestTypes[2].property] = decodedFragments[2];
          xmlaRequest.restrictions = restrictions;
      case 2:
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

    var x = new xmla.Xmla();
    x.request(xmlaRequest);
  }).listen(port);

}

//--------------------------Export Modules------------------------------------------------------------------
module.exports = {
  discoverDataSourceName : discoverDataSourceName,
  discoverCatalogName: discoverCatalogName,
  discoverCubeName : discoverCubeName,
  discoverDimensions : discoverDimensions,
  discoverHierarchies : discoverHierarchies,
  discoverLevels : discoverLevels,
  discoverMembers : discoverMembers
}

//----------------------------------------Test Code--------------------------------------------------------------------
//
//
// var options2 = {};
// options2.xmlaServer = "http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password";
// options2.pathName = "/Pentaho";
// options2.hostAddress = "http://localhost:8080";
//
// discoverCatalogName(options2);
