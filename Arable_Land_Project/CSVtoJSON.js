var content;
var fs=require("fs");
var readline = require('readline');
var stream = require('stream');



//Search Parameters
var countryCodeIndia="IND";
var percentLandAreaCode="AG.LND.ARBL.ZS";
var hectaresPerPersonCode="AG.LND.ARBL.HA.PC";
var totalHectaresCode="AG.LND.ARBL.HA";
var continentCodeAfrica="AF";
var continentCodeAsia="AS";
var continentCodeNorthAmerica="NA";
var continentCodeSouthAmerica="SA";
var continentCodeOceania="OC";
var continentCodeEurope="EU";

//Required Objects to be converted to JSON
var reqPercentLandAreaIndia = {};
var reqHectaresPerPersonIndia = {};
var reqTotalHectaresIndia = {};
var reqPercentLandAreaAfrica2010 = {};
var reqTotalHectaresByContinent = {
  AF : {},
  AS : {},
  EU : {},
  NA : {},
  OC : {},
  SA : {}
};

//Initialise finction for Plot3
function init(customObject) {
  for(var index=1960;index<2016;index++) {
    customObject[index]=0;
  }
}

//Cleanup function- Remove keys with value 0
function cleanUp(customObject) {
  for(var counter in customObject) {
    if(customObject[counter]===0) {
      delete customObject[counter];
    }
  }
}

//Reading countries.csv file to add country continent key value pairs
var instream1 = fs.createReadStream('countries.csv');
var outstream1 = new stream;
var r1 = readline.createInterface(instream1,outstream1);
var headers1; //Stores the headers
var headerFlag1 = 0;  //Flag to skip header
var countryContinent = {}; //Country Continent Object with country as key and continent as value
var endOfRead1 = 0; //Flag to start Reading File 2

r1.on('line', function(line) {
  if(headerFlag1===0) {
    headers1 = String(line).split(",");
    headerFlag1=1;
  }

  else {
    countryContinent[String(line).split(",")[4].trim()] = String(line).split(",")[6].trim();
  }
});

r1.on('close', function() {
  //Initialising Plot3 objects to 0
  init(reqTotalHectaresByContinent.AF);
  init(reqTotalHectaresByContinent.AS);
  init(reqTotalHectaresByContinent.EU);
  init(reqTotalHectaresByContinent.NA);
  init(reqTotalHectaresByContinent.OC);
  init(reqTotalHectaresByContinent.SA);
});

//Reading WDI_Data.csv file to create required Objects

var instream2 = fs.createReadStream('WDI_Data.csv');
var outstream2 = new stream;
var r2 = readline.createInterface(instream2, outstream2);
var headerFlag2=0;
var headers2;


r2.on('line', function(line) {
  //obtain headers2 as an array of Strings
  if(headerFlag2===0) {
    headers2=String(line).split(",");
    headerFlag2=1;
  }


  //Arable land (% of land area)-INDIA
  if(String(line).split(",")[1]===countryCodeIndia && String(line).split(",")[3]===percentLandAreaCode) {
    for(var index1=4;index1<headers2.length;index1++) {
      if(String(line).split(",")[index1] !== "") {
        reqPercentLandAreaIndia [headers2[index1]] = parseFloat((String(line).split(",")[index1]));
      }
    }
  }

  //Arable land (hectares per person)-INDIA
  if(String(line).split(",")[1]===countryCodeIndia && String(line).split(",")[3]===hectaresPerPersonCode) {
    for(var index2=4;index2<headers2.length;index2++) {
      if(String(line).split(",")[index2] !== "") {
        reqHectaresPerPersonIndia [headers2[index2]] = parseFloat((String(line).split(",")[index2]));
      }
    }
  }

  //Arable land (hectares)-INDIA
  if(String(line).split(",")[1]===countryCodeIndia && String(line).split(",")[3]===totalHectaresCode) {
    for(var index3=4;index3<headers2.length;index3++) {
      if(String(line).split(",")[index3] !== "") {
        reqTotalHectaresIndia [headers2[index3]] = parseFloat((String(line).split(",")[index3]));
      }
    }
  }

  //Arable land (% of land area)" for African countries in the year 2010
  if(countryContinent[String(line).split(",")[1]]===continentCodeAfrica && String(line).split(",")[3]===percentLandAreaCode) {
    if(String(line).split(",")[54]!=="") {
      reqPercentLandAreaAfrica2010[String(line).split(",")[1]] = parseFloat(String(line).split(",")[54]);
    }
  }

  //Arable land (hectares) aggregated by continent over the years data
  //1.Africa
  if(countryContinent[String(line).split(",")[1]]===continentCodeAfrica && String(line).split(",")[3]===totalHectaresCode) {
    for(var index4=4;index4<headers2.length;index4++) {
      if(String(line).split(",")[index4]!=="") {
        reqTotalHectaresByContinent[continentCodeAfrica][headers2[index4]]+=parseFloat(String(line).split(",")[index4]);
      }
    }
  }

  //2.Asia
  if(countryContinent[String(line).split(",")[1]]===continentCodeAsia && String(line).split(",")[3]===totalHectaresCode) {
    for(var index5=4;index5<headers2.length;index5++) {
      if(String(line).split(",")[index5]!=="") {
        reqTotalHectaresByContinent[continentCodeAsia][headers2[index5]]+=parseFloat(String(line).split(",")[index5]);
      }
    }
  }

  //3.Europe
  if(countryContinent[String(line).split(",")[1]]===continentCodeEurope && String(line).split(",")[3]===totalHectaresCode) {
    for(var index6=4;index6<headers2.length;index6++) {
      if(String(line).split(",")[index6]!=="") {
        reqTotalHectaresByContinent[continentCodeEurope][headers2[index6]]+=parseFloat(String(line).split(",")[index6]);
      }
    }
  }

  //4.North America
  if(countryContinent[String(line).split(",")[1]]===continentCodeNorthAmerica && String(line).split(",")[3]===totalHectaresCode) {
    for(var index7=4;index7<headers2.length;index7++) {
      if(String(line).split(",")[index7]!=="") {
        reqTotalHectaresByContinent[continentCodeNorthAmerica][headers2[index7]]+=parseFloat(String(line).split(",")[index7]);
      }
    }
  }

  //5.Oceania
  if(countryContinent[String(line).split(",")[1]]===continentCodeOceania && String(line).split(",")[3]===totalHectaresCode) {
    for(var index8=4;index8<headers2.length;index8++) {
      if(String(line).split(",")[index8]!=="") {
        reqTotalHectaresByContinent[continentCodeOceania][headers2[index8]]+=parseFloat(String(line).split(",")[index8]);
      }
    }
  }

  //6.South America
  if(countryContinent[String(line).split(",")[1]]===continentCodeSouthAmerica && String(line).split(",")[3]===totalHectaresCode) {
    for(var index9=4;index9<headers2.length;index9++) {
      if(String(line).split(",")[index9]!=="") {
        reqTotalHectaresByContinent[continentCodeSouthAmerica][headers2[index9]]+=parseFloat(String(line).split(",")[index9]);
      }
    }
  }

});




r2.on('close', function() {
  fs.writeFile('reqPercentLandAreaIndia.json', JSON.stringify(reqPercentLandAreaIndia,null,2));
  fs.writeFile('reqHectaresPerPersonIndia.json', JSON.stringify(reqHectaresPerPersonIndia,null,2));
  fs.writeFile('reqTotalHectaresIndia.json', JSON.stringify(reqTotalHectaresIndia,null,2));
  fs.writeFile('reqPercentLandAreaAfrica2010.json', JSON.stringify(reqPercentLandAreaAfrica2010,null,2));
  cleanUp(reqTotalHectaresByContinent.AF);
  cleanUp(reqTotalHectaresByContinent.AS);
  cleanUp(reqTotalHectaresByContinent.EU);
  cleanUp(reqTotalHectaresByContinent.NA);
  cleanUp(reqTotalHectaresByContinent.OC);
  cleanUp(reqTotalHectaresByContinent.SA);
  fs.writeFile('reqTotalHectaresByContinent.json', JSON.stringify(reqTotalHectaresByContinent,null,2));
});
