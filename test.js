var assert = require("assert")
var _ = require("underscore")
//describe('Array', function(){
//  describe('#indexOf()', function(){
//      it('should return -1 when the value is not present', function(){
//            assert.equal(-1, [1,2,3].indexOf(5));
//            assert.equal(-1, [1,2,3].indexOf(1));
//          })
//    })
//})

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
	      var convert = function(cj){
		    var x = _.omit(cj, 'prompt'); 
		   var key = x["name"];
		   var value = x["value"];
		   var y = {};
		   y[key] = value;
		    return y;
	    }

	    var marshallCjData = function(cj) {
	  	var dataArray = [];
		var items = cj["collection"]["items"]
	   	if (items.length > 0) {
			//dataArray[0] = items[0]["data"][0];	
			for (i = 0; i < items.length; i++) {
				for(j = 0; j < items[i]["data"].length; j++) { 
					dataArray[j] = items[i]["data"][j]; 
				}
			}
		}; 
		return dataArray; 
	    
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

}) 

describe('Convert', function() {
      it('should return key value pair', function(){
	  var cj =  {"name" : "Current", "value" : false, "prompt" : "Current"};
            //assert.equal({Current: false, "Effective Date" :'2014/12/01', Position: 'President', By: 'Richard Hatton', Updated: "2014/12/01" }, convert(cj));
//            assert.ok(false);
//            assert.ok( _.isEqual({name: "Current", value: false}, convert(cj)));
            assert.ok( _.isEqual({Current: false}, convert(cj)));
//            assert.equal({Current: false}, convert(cj));
          })
})

