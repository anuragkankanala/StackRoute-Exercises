var xmla = require("./xmla4js-master/src/Xmla.js"),
    http = require("http"),
    url = require("url"),
    port = 8080,
    X = xmla.Xmla,
    localhost="http://localhost:8080",
    serverURL = "url=http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password",
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
function buildCustomURL(host,pathname,query) {
  return host+"/"+pathname+"?"+query;
}
function decodeFragments(fragments) {
    var decodedFragments = [], i, n = fragments.length;
    for (i = 0; i < n; i++) {
        decodedFragments.push(decodeURIComponent(fragments[i]));
    }
    return decodedFragments;
}

http.createServer(function(request,response){
  var httpMethod = request.method;

  if (!({
      "GET": true,
      "HEAD": true
  })[httpMethod]) {
      httpError(response, 405, "Method must be GET or HEAD");
      return;
  }

  function getDataSourceName(customURL) {
    pathname = "";
    var requestURL = url.parse(buildCustomURL(localhost,pathname,serverURL),true);
    var fragments = requestURL.pathname.split("/"),
        decodedFragments = decodeFragments(fragments),
        numFragments = fragments.length,
        properties = {},
        restrictions = {},
        discoverRequestType = discoverRequestTypes[numFragments],
        xmlaRequest = {
          async:true,
          url:"http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password",
          success:function(xmla,xmlaRequest,xmlaResponse) {
            response.write(xmlaResponse);
            console.log(xmlaResponse);
          },
          callback:function() {
            response.end();
          }
        };

    requestURL.fragments = fragments;
    requestURL.decodedFragments = decodedFragments;
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
    var x = new xmla.Xmla();
    x.request(xmlaRequest);
  }




}).listen(8080);
