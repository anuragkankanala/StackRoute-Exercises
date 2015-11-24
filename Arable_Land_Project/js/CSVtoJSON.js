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
var reqPercentLandAreaIndia = [];
var reqHectaresPerPersonIndia = [];
var reqTotalHectaresIndia = [];
var reqPercentLandAreaAfrica2010 = [];
var reqTotalHectaresByContinentAF=[];
var reqTotalHectaresByContinentAS=[];
var reqTotalHectaresByContinentEU=[];
var reqTotalHectaresByContinentNA=[];
var reqTotalHectaresByContinentOC=[];
var reqTotalHectaresByContinentSA=[];

//Initialise finction for Plot3
function init(customArray) {
  for(var ijk=(1960-1960);ijk<(2016-1960);ijk++) {
    customArray[ijk]={};
    customArray[ijk]["VALUE"]=0;
  }
}

//Cleanup function- Remove keys with value 0
function cleanUp(customArray) {
  for(var jkl in customArray ) {
    if(parseFloat(customArray[jkl]["VALUE"])===0) {
      customArray.splice(jkl,1);
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
  init(reqTotalHectaresByContinentAF);
  init(reqTotalHectaresByContinentAS);
  init(reqTotalHectaresByContinentEU);
  init(reqTotalHectaresByContinentNA);
  init(reqTotalHectaresByContinentOC);
  init(reqTotalHectaresByContinentSA);
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
        var tempObj1 = {};
        tempObj1["YEAR"] = headers2[index1];
        tempObj1["VALUE"] = parseFloat((String(line).split(",")[index1]));
        reqPercentLandAreaIndia.push(tempObj1);
      }
    }
  }

  //Arable land (hectares per person)-INDIA
  if(String(line).split(",")[1]===countryCodeIndia && String(line).split(",")[3]===hectaresPerPersonCode) {
    for(var index2=4;index2<headers2.length;index2++) {
      if(String(line).split(",")[index2] !== "") {
        var tempObj2 = {};
        tempObj2["YEAR"] = headers2[index2];
        tempObj2["VALUE"] = parseFloat((String(line).split(",")[index2]));
        reqHectaresPerPersonIndia.push(tempObj2);
      }
    }
  }

  //Arable land (hectares)-INDIA
  if(String(line).split(",")[1]===countryCodeIndia && String(line).split(",")[3]===totalHectaresCode) {
    for(var index3=4;index3<headers2.length;index3++) {
      if(String(line).split(",")[index3] !== "") {
        var tempObj3 = {};
        tempObj3["YEAR"] = headers2[index3];
        tempObj3["VALUE"] = parseFloat((String(line).split(",")[index3]));
        reqTotalHectaresIndia.push(tempObj3);
      }
    }
  }

  //Arable land (% of land area)" for African countries in the year 2010
  if(countryContinent[String(line).split(",")[1]]===continentCodeAfrica && String(line).split(",")[3]===percentLandAreaCode) {
    if(String(line).split(",")[54]!=="") {
      tempObj4 = {};
      tempObj4["COUNTRY"] = String(line).split(",")[1];
      tempObj4["VALUE"] = parseFloat(String(line).split(",")[54]);
      reqPercentLandAreaAfrica2010.push(tempObj4);
    }
  }

  //Arable land (hectares) aggregated by continent over the years data
  //1.Africa
  if(countryContinent[String(line).split(",")[1]]===continentCodeAfrica && String(line).split(",")[3]===totalHectaresCode) {
    for(var index4=4;index4<headers2.length;index4++) {
      if(String(line).split(",")[index4]!=="") {
        reqTotalHectaresByContinentAF[(headers2[index4]-1960)]["YEAR"] = headers2[index4];
        reqTotalHectaresByContinentAF[(headers2[index4]-1960)]["VALUE"]+=parseFloat(String(line).split(",")[index4]);
      }
    }
  }

  //2.Asia
  if(countryContinent[String(line).split(",")[1]]===continentCodeAsia && String(line).split(",")[3]===totalHectaresCode) {
    for(var index5=4;index5<headers2.length;index5++) {
      if(String(line).split(",")[index5]!=="") {
        reqTotalHectaresByContinentAS[(headers2[index5]-1960)]["YEAR"] = headers2[index5];
        reqTotalHectaresByContinentAS[(headers2[index5]-1960)]["VALUE"]+=parseFloat(String(line).split(",")[index5]);
      }
    }
  }

  //3.Europe
  if(countryContinent[String(line).split(",")[1]]===continentCodeEurope && String(line).split(",")[3]===totalHectaresCode) {
    for(var index6=4;index6<headers2.length;index6++) {
      if(String(line).split(",")[index6]!=="") {
        reqTotalHectaresByContinentEU[(headers2[index6]-1960)]["YEAR"] = headers2[index6];
        reqTotalHectaresByContinentEU[(headers2[index6]-1960)]["VALUE"]+=parseFloat(String(line).split(",")[index6]);
      }
    }
  }

  //4.North America
  if(countryContinent[String(line).split(",")[1]]===continentCodeNorthAmerica && String(line).split(",")[3]===totalHectaresCode) {
    for(var index7=4;index7<headers2.length;index7++) {
      if(String(line).split(",")[index7]!=="") {
        reqTotalHectaresByContinentNA[(headers2[index7]-1960)]["YEAR"] = headers2[index7];
        reqTotalHectaresByContinentNA[(headers2[index7]-1960)]["VALUE"]+=parseFloat(String(line).split(",")[index7]);
      }
    }
  }

  //5.Oceania
  if(countryContinent[String(line).split(",")[1]]===continentCodeOceania && String(line).split(",")[3]===totalHectaresCode) {
    for(var index8=4;index8<headers2.length;index8++) {
      if(String(line).split(",")[index8]!=="") {
        reqTotalHectaresByContinentOC[(headers2[index8]-1960)]["YEAR"] = headers2[index8];
        reqTotalHectaresByContinentOC[(headers2[index8]-1960)]["VALUE"]+=parseFloat(String(line).split(",")[index8]);
      }
    }
  }

  //6.South America
  if(countryContinent[String(line).split(",")[1]]===continentCodeSouthAmerica && String(line).split(",")[3]===totalHectaresCode) {
    for(var index9=4;index9<headers2.length;index9++) {
      if(String(line).split(",")[index9]!=="") {
        reqTotalHectaresByContinentSA[(headers2[index9]-1960)]["YEAR"] = headers2[index9];
        reqTotalHectaresByContinentSA[(headers2[index9]-1960)]["VALUE"]+=parseFloat(String(line).split(",")[index9]);
      }
    }
  }

});





r2.on('close', function() {
  fs.writeFile('reqPercentLandAreaIndia.json', JSON.stringify(reqPercentLandAreaIndia,null,2));
  fs.writeFile('reqHectaresPerPersonIndia.json', JSON.stringify(reqHectaresPerPersonIndia,null,2));
  fs.writeFile('reqTotalHectaresIndia.json', JSON.stringify(reqTotalHectaresIndia,null,2));
  fs.writeFile('reqPercentLandAreaAfrica2010.json', JSON.stringify(reqPercentLandAreaAfrica2010,null,2));
  cleanUp(reqTotalHectaresByContinentAF);
  cleanUp(reqTotalHectaresByContinentAS);
  cleanUp(reqTotalHectaresByContinentEU);
  cleanUp(reqTotalHectaresByContinentNA);
  cleanUp(reqTotalHectaresByContinentOC);
  cleanUp(reqTotalHectaresByContinentSA);
  reqTotalHectaresByContinentAF = {data:reqTotalHectaresByContinentAF, name:"Africa"};
  reqTotalHectaresByContinentAS = {data:reqTotalHectaresByContinentAS, name:"Asia"};
  reqTotalHectaresByContinentEU = {data:reqTotalHectaresByContinentEU, name:"Europe"};
  reqTotalHectaresByContinentNA = {data:reqTotalHectaresByContinentNA, name:"North America"};
  reqTotalHectaresByContinentOC = {data:reqTotalHectaresByContinentOC, name:"Oceania"};
  reqTotalHectaresByContinentSA = {data:reqTotalHectaresByContinentSA, name:"South America"};
  fs.writeFile('reqTotalHectaresByContinentAF.json', JSON.stringify(reqTotalHectaresByContinentAF,null,2));
  fs.writeFile('reqTotalHectaresByContinentAS.json', JSON.stringify(reqTotalHectaresByContinentAS,null,2));
  fs.writeFile('reqTotalHectaresByContinentEU.json', JSON.stringify(reqTotalHectaresByContinentEU,null,2));
  fs.writeFile('reqTotalHectaresByContinentNA.json', JSON.stringify(reqTotalHectaresByContinentNA,null,2));
  fs.writeFile('reqTotalHectaresByContinentOC.json', JSON.stringify(reqTotalHectaresByContinentOC,null,2));
  fs.writeFile('reqTotalHectaresByContinentSA.json', JSON.stringify(reqTotalHectaresByContinentSA,null,2));
});
