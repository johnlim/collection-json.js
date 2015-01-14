var assert = require("assert");
var _ = require("underscore");
var collectionJson = require("./collection-json.js");

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
			assert.ok(_.isEqual([], collectionJson.getData(cj)));
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
			assert.ok(_.isEqual([[{"name" : "Current", "value" : false, "prompt" : "Current"}], [{"name" : "Current", "value" : true, "prompt" : "Current"}]], collectionJson.getData(cj)));
		})
	});
});

describe('Convert', function() {
	var cj =  [[{"name" : "Current", "value" : false, "prompt" : "Current"}]];
	it('should return key value pair', function(){
		assert.ok( _.isEqual([{Current: false}], collectionJson.formatData(cj)));
	})
});

describe('marshallCjData', function(){
	describe('When given valid Cj with no items child property', function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/"
		}
		};
		it('format returns empty array', function() {
			assert.ok(_.isEqual([], collectionJson.marshallCjData(cj)));
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
			assert.ok(_.isEqual([], collectionJson.marshallCjData(cj)));
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
			assert.ok(_.isEqual([{"Current": false}], collectionJson.marshallCjData(cj)));
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
			assert.ok(_.isEqual([{"Current": false, "Effective Date": "2014/12/01" }], collectionJson.marshallCjData(cj)));
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
			assert.ok(_.isEqual([], collectionJson.marshallCjData(cj)));
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
			assert.ok(_.isEqual([], collectionJson.marshallCjData(cj)));
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
			assert.ok(_.isEqual([{"Current": false}, {"Current": true}], collectionJson.marshallCjData(cj)));
		})
	});

	describe('When given valid Cj with 2 items and 2 data each', function() {
		var cj = { "collection" :
		{
			"version" : "1.0",
			"href" : "http://example.org/friends/",
			"items" : [
				{
					"href" : "http://example.org/friends/jdoe",
					"data" : [
						{"name" : "Current", "value" : false, "prompt" : "Current"},
						{"name" : "Effective Date", "value" : "2014/1/1", "prompt" : "With Effect From"}
					],
					"links" : [ ]
				},
				{
					"href" : "http://example.org/friends/jdoe",
					"data" : [
						{"name" : "Current", "value" : true, "prompt" : "Current"},
						{"name" : "Effective Date", "value" : "2015/5/5", "prompt" : "With Effect From"}
					],
					"links" : [ ]
				}
			]
		}
		};
		it('should return array with 2 sets of data with 1 key/value pair each', function(){
			assert.ok(_.isEqual([{"Current": false, "Effective Date": "2014/1/1"}, {"Current": true, "Effective Date": "2015/5/5"}], collectionJson.marshallCjData(cj)));
		})
	});
});
