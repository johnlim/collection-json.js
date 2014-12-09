var assert = require("assert")
var _ = require("underscore")

var convert = function(dataArray){
	var data = {}
	for (i = 0; i < dataArray.length; i++){
		var x = _.omit(dataArray[i], 'prompt');
		var key = x["name"];
		var value = x["value"];
		data[key] = value;
	}
	return data;
}

var marshallCjItems = function(cj) {
	var itemArray = cj["collection"]["items"];
	return itemArray;
}

var marshallCjData = function(cj) {
	var dataArray = [];
	var items = cj["collection"]["items"]
	try {
		if (items && items.length > 0) {
			for (i = 0; i < items.length; i++) {
				for (j = 0; j < items[i]["data"].length; j++) {
					dataArray[j] = items[i]["data"][j];
				}
			}
		}
	}
	catch(err) {
		dataArray = [];
	}
	return dataArray;

}

var format = function(cj) {
	var extract = marshallCjData(cj);

	if (extract.length > 0) {
		return convert(extract);
	}
	return extract;
}

describe('marshallCjData', function(){
	describe('when given valid CJ with 0 items', function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/",

			"items" : [
			]
		}
		}
		it('should return empty array', function() {
			assert.ok(_.isEqual([], marshallCjData(cj)));
		})
	})

	describe('when given valid CJ with 1 item and 1 data', function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/",

			"items" : [
				{
					"href" : "http://example.org/friends/jdoe",
					"data" : [
						{"name" : "full-name", "value" : "J. Doe", "prompt" : "Full Name"},
					],
				}
			]
		}
		}
		it('should be able to extract the data', function(){
			assert.ok( _.isEqual({"name" : "full-name", "value" : "J. Doe", "prompt" : "Full Name"}, marshallCjData(cj)[0]));

		})

	})

	describe('when given valid Cj with 1 items and 2 data', function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/",

			"items" : [
				{
					"href" : "http://example.org/friends/jdoe",
					"data" : [
						{"name" : "full-name", "value" : "J. Doe", "prompt" : "Full Name"},
						{"name" : "email", "value" : "J@Doe", "prompt" : "Email"},
					],
				}
			]
		}
		}
		it('should extract 2 sets of data', function() {
			assert.equal(marshallCjData(cj).length, 2);
			assert.ok( _.isEqual({"name" : "full-name", "value" : "J. Doe", "prompt" : "Full Name"}, marshallCjData(cj)[0]));
			assert.ok( _.isEqual({"name" : "email", "value" : "J@Doe", "prompt" : "Email"}, marshallCjData(cj)[1]));

		})

	})

	describe('when given valid Cj with 2 items and 1 data set each', function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/",

			"items" : [
				{
					"href" : "http://example.org/friends/jdoe",
					"data" : [
						{"name" : "full-name", "value" : "J. Doe", "prompt" : "Full Name"},
					],
				},

				{
					"href" : "http://example.org/friends/johnlim",
					"data" : [
						{"name" : "full-name", "value" : "John Lim ", "prompt" : "Full Name"},
					],
				}
			]
		}
		}
		it('should extract 2 sets of items', function() {
			assert.equal(marshallCjItems(cj).length, 2);
			//assert.ok( _.isEqual({"name" : "full-name", "value" : "J. Doe", "prompt" : "Full Name"}, marshallCjData(cj)[0]));
			//assert.ok( _.isEqual({"name" : "email", "value" : "J@Doe", "prompt" : "Email"}, marshallCjData(cj)[1]));

		})

	})

})

describe('Convert', function() {
	it('should return key value pair', function(){
		var cj =  [{"name" : "Current", "value" : false, "prompt" : "Current"}];
		//assert.equal({Current: false, "Effective Date" :'2014/12/01', Position: 'President', By: 'Richard Hatton', Updated: "2014/12/01" }, convert(cj));
//            assert.ok(false);
//            assert.ok( _.isEqual({name: "Current", value: false}, convert(cj)));
		assert.ok( _.isEqual({Current: false}, convert(cj)));
//            assert.equal({Current: false}, convert(cj));
	})
})

describe('When given valid Cj with no items child property', function() {
	var cj = { "collection" :
	{
		"version" : "1.0",
		"href" : "http://example.org/friends/",
	}
	}
	it('format returns empty array', function() {
		assert.ok(_.isEqual([],format(cj)));
	})
})

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
	}
	it('format returns empty array', function() {
		assert.ok(_.isEqual([],format(cj)));
	})
})

describe('When given valid Cj with 1 item and 1 data', function() {
	it('should return key value pair', function(){
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
		}

		assert.ok(_.isEqual({"Current": false}, format(cj)));
	})
})

describe('When given valid Cj with 1 item and 2 data', function() {
	it('should return key value pair', function(){
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
		}

		assert.ok(_.isEqual({"Current": false, "Effective Date": "2014/12/01" }, format(cj)));
	})
})

describe('When given valid Cj with 2 items and 0 data', function() {
	it('should return empty array', function(){
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
		}

		assert.ok(_.isEqual([], format(cj)));
	})
})

describe('When given valid Cj with 2 items and does not contain data child property in all items', function() {
	it('should return empty array', function(){
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
		}

		assert.ok(_.isEqual([], format(cj)));
	})
})
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
