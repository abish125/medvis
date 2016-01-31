var ekg = function()
{
    this.data = data;
    this.total_points = data.length;
    this.total_time = 10000;
    this.each_point_time = this.total_time/this.total_points;
    this.mode = mode(data);
    this.modes = arr.modes(data);
    this.highest_point = arr.max(data);
    this.lowest_point = arr.min(data);
    this.current_state_options = ["initial_calibration", "atrium contracting", "ventricle contracting"];
    this.z_scores = arr.zScores(data);
	this.current_point = data[0];
	this.current_i = 0;
	this.types_of_ekgs = ["12 lead", "anesthesia five lead", "three leed"]
}

var which_state = function()
{
	if(this.z_scores[this.current_i] > 2.8)	
	{
		
	}
}

var type_of_ekg = function()
{
	//12 lead has the starting calibration step function
	//the others do not (start with this)
	//check to see if the first 
}

ekg.prototype.constructor = ekg;
ekg.prototype.which_state = which_state;
ekg.prototype.type_of_ekg = type_of_ekg;

function mode(array)
{
    if(array.length == 0)
    	return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
    	var el = array[i];
    	if(modeMap[el] == null)
    		modeMap[el] = 1;
    	else
    		modeMap[el]++;	
    	if(modeMap[el] > maxCount)
    	{
    		maxEl = el;
    		maxCount = modeMap[el];
    	}
    }
    return maxEl;
}

var arr = {	
	max: function(array) {
		return Math.max.apply(null, array);
	},
	
	min: function(array) {
		return Math.min.apply(null, array);
	},
	
	range: function(array) {
		return arr.max(array) - arr.min(array);
	},
	
	midrange: function(array) {
		return arr.range(array) / 2;
	},

	sum: function(array) {
		var num = 0;
		for (var i = 0, l = array.length; i < l; i++) num += array[i];
		return num;
	},
	
	mean: function(array) {
		return arr.sum(array) / array.length;
	},
	
	median: function(array) {
		array.sort(function(a, b) {
			return a - b;
		});
		var mid = array.length / 2;
		return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
	},
	
	modes: function(array) {
		if (array.length === 0) return null;
		var modeMap = {},
			maxCount = 1,
			modes = [array[0]];
		
		array.forEach(function(val) {			
			if (modeMap[val] === undefined) modeMap[val] = 1;
			else modeMap[val]++;
			
			if (modeMap[val] > maxCount) {
				modes = [val];
				maxCount = modeMap[val];
			}
			else if (modeMap[val] == maxCount) {
				modes.push(val);
				maxCount = modeMap[val];
			}
		});
		return modes;
	},
	
	variance: function(array) {
		var mean = arr.mean(array);
		return arr.mean(array.map(function(num) {
			return Math.pow(num - mean, 2);
		}));
	},
	
	standardDeviation: function(array) {
		return Math.sqrt(arr.variance(array));
	},
	
	meanAbsoluteDeviation: function(array) {
		var mean = arr.mean(array);
		return arr.mean(array.map(function(num) {
			return Math.abs(num - mean);
		}));
	},
	
	zScores: function(array) {
		var mean = arr.mean(array);
		var standardDeviation = arr.standardDeviation(array);
		return array.map(function(num) {
			return (num - mean) / standardDeviation;
		});
	}
};

// Function aliases:
arr.average = arr.mean;