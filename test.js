var assert = require("assert");
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

describe('getData', function(){
	describe('when given valid CJ with 0 items', function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/",

			"items" : [
			]
		}
		};
		it('should return empty array', function() {
			assert.ok(_.isEqual([], getData(cj)));
		})
	});

	describe("When given valid Cj with 2 items with 1 data each", function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/",
			"items" : [
				{
					"href" : "http://example.org/friends/jdoe",
					"data" : [
						{"name" : "Current", "value" : false, "prompt" : "Current"}
					],
					"links" : [ ]
				},
				{
					"href" : "http://example.org/friends/jdoe",
					"data" : [
						{"name" : "Current", "value" : true, "prompt" : "Current"}
					],
					"links" : [ ]
				}
			]
		}
		};
		it('should return expected', function() {
			assert.ok(_.isEqual([[{"name" : "Current", "value" : false, "prompt" : "Current"}], [{"name" : "Current", "value" : true, "prompt" : "Current"}]], getData(cj)));
		})
	});
});

describe('Convert', function() {
	var cj =  [[{"name" : "Current", "value" : false, "prompt" : "Current"}]];
	it('should return key value pair', function(){
		assert.ok( _.isEqual([{Current: false}], formatData(cj)));
	})
});
describe('getData', function(){

	describe('When given valid Cj with no items child property', function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/"
		}
		};
		it('format returns empty array', function() {
			assert.ok(_.isEqual([],marshallCjData(cj)));
		})
	});

	describe('When given valid Cj with 1 items and no data child property', function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/",
			"items" : [
				{
					"href" : "uri"
				}
			]
		}
		};
		it('format returns empty array', function() {
			assert.ok(_.isEqual([],marshallCjData(cj)));
		})
	});

	describe('When given valid Cj with 1 item and 1 data', function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/",
			"items" : [
				{
					"href" : "http://example.org/friends/jdoe",
					"data" : [
						{"name" : "Current", "value" : false, "prompt" : "Current"}
					],
					"links" : [ ]
				}
			]
		}
		};
		it('should return key value pair', function(){
			assert.ok(_.isEqual([{"Current": false}], marshallCjData(cj)));
		})
	});

	describe('When given valid Cj with 1 item and 2 data', function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/",
			"items" : [
				{
					"href" : "http://example.org/friends/jdoe",
					"data" : [
						{"name" : "Current", "value" : false, "prompt" : "Current"},
						{"name" : "Effective Date", "value": "2014/12/01", "prompt" : "Effective Date"}
					],
					"links" : [ ]
				}
			]
		}
		};
		it('should return key value pair', function(){
			assert.ok(_.isEqual([{"Current": false, "Effective Date": "2014/12/01" }], marshallCjData(cj)));
		})
	});

	describe('When given valid Cj with 2 items and 0 data', function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/",
			"items" : [
				{
					"href" : "http://example.org/friends/jdoe",
					"links" : [ ]
				},
				{
					"href" : "uri",
					"links" : [ ]
				}
			]
		}
		};
		it('should return empty array', function(){
			assert.ok(_.isEqual([], marshallCjData(cj)));
		})
	});

	describe('When given valid Cj with 2 items and does not contain data child property in all items', function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/",
			"items" : [
				{
					"href" : "http://example.org/friends/jdoe",
					"data" : [
						{"name" : "Current", "value" : false, "prompt" : "Current"}
					],
					"links" : [ ]
				},
				{
					"href" : "http://example.org/friends/jdoe",
					"links" : [ ]
				}
			]
		}
		};
		it('should return empty array', function(){
			assert.ok(_.isEqual([], marshallCjData(cj)));
		})
	});

	describe('When given valid Cj with 2 items and 1 data each', function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/",
			"items" : [
				{
					"href" : "http://example.org/friends/jdoe",
					"data" : [
						{"name" : "Current", "value" : false, "prompt" : "Current"}
					],
					"links" : [ ]
				},
				{
					"href" : "http://example.org/friends/jdoe",
					"data" : [
						{"name" : "Current", "value" : true, "prompt" : "Current"}
					],
					"links" : [ ]
				}
			]
		}
		};
		it('should return array with 2 sets of data with 1 key/value pair each', function(){
			assert.ok(_.isEqual([{"Current": false}, {"Current": true}], marshallCjData(cj)));
		})
	});
});


/*
 "data" : [
 {"name" : "Current", "value" : false, "prompt" : "Current"},
 {"name" : "Effective Date", "value" : "2014/12/01", "prompt" : "Effective Date"},
 {"name" : "Position", "value" : "President", "prompt" : "Position"},
 {"name" : "By", "value" : "Richard Hatton", "prompt" : "By"},
 {"name" : "Updated", "value" : "2014/12/01", "prompt" : "Updated"}
 ],

 [{Current: false, Effective Date:'2014/12/01', Position: 'President', By: 'Richard Hatton', Updated: ""2014/12/01 },
 {name:'Mary', phone:'555-9876', age:19},
 {name:'Mike', phone:'555-4321', age:21},
 {name:'Adam', phone:'555-5678', age:35},
 {name:'Julie', phone:'555-8765', age:29}
 ];
 */
