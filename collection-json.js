var _ = require("underscore");

var transformDataIntoKeyValue = function(dataArray) {
	var data = {};
	for (var j = 0; j < dataArray.length; j++) {
		var x = _.omit(dataArray[j], 'prompt');
		var key = x["name"];
		var value = x["value"];
		data[key] = value;
	}
	return data;
};

var formatData = function(dataArray){
	var formattedData = [];
	for (var i = 0; i < dataArray.length; i++){
		formattedData.push(transformDataIntoKeyValue(dataArray[i]));
	}
	return formattedData;
};

var marshallCjItems = function(cj) {
	var itemArray = cj["collection"]["items"];
	return itemArray;
}

var extractData = function(items) {
	var dataArray = [];
	for (var j = 0; j < items["data"].length; j++) {
		dataArray[j] = items["data"][j];
	}
	return dataArray;
};

var getData = function(cj) {
	var dataArray = [];
	var items = cj["collection"]["items"];
	try {
		for (var i = 0; i < items.length; i++) {
			dataArray.push(extractData(items[i]));
		}
	}
	catch(err) {
		dataArray = [];
	}
	return dataArray;
};

var marshallCjData = function(cj) {
	var data= getData(cj);

	if (data.length > 0) {
		return formatData(data);
	}
	return data;
}

module.exports = {
	getData : getData,
	formatData: formatData,
	marshallCjData : marshallCjData
}
