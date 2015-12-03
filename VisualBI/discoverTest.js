var xmla = require("./xmla4js-master/src/Xmla.js"),
    port = 8080,
    url = require("url"),
    http = require("http"),
    X = xmla.Xmla;

//Generate Fragments of pathname
function decodeFragments(fragments) {
  var decodedFragments = [], i, n= fragments.length;
  for (i=0; i<n; i++) {
    decodedFragments.push(decodeURIComponent(fragments[i]));
  }
  return decodedFragments;
}



  // var fragments = requestUrl.pathname.split("/"),
  //     decodedFragments = decodeFragments(fragments),
  //     numFragments = fragments.length
  //     properties = {},
  //     restrictions = {},
  //     discoverRequestType = discoverRequestTypes[numFragments],
  //     xmlaRequest = {
  //       async: true,
  //       url: xmlaUrl,
  //       success: function(xmla, xmlaRequest, xmlaResponse) {
  //           //It worked, call the content handler to write the data to the response
  //           console.log("\nResponse:");
  //           console.log(xmla.responseText);
  //       },
  //       callback: function(){
  //           //callback gets always called after either success or error,
  //           //use it to conclude the response.
  //           response.end();
  //       }
  //   };

function discoverDimensions() {

    var properties = {};
    properties[X.PROP_DATASOURCEINFO] = "Pentaho";
    properties[X.PROP_CATALOG] = "SampleData";

    var restrictions = {};
    restrictions["CATALOG_NAME"] = "SampleData";
    restrictions["CUBE_NAME"] = "Quadrant Analysis";

    // if (!url){
    //     url = getUrl();
    // }
    var rowset = X.discoverMDDimensions({
        url: "http://172.23.238.252:8080/pentaho/Xmla%3fuserid=admin%26password=password"
    ,   properties: properties
    ,   restrictions: restrictions
    });
    console.log(rowset);

}
  discoverDimensions();
