function BinSearchDemo (arr, idx) {
	this.labels = 'elements,compares,status,operation';
	this.items = arr.slice (0);
	this.initialItems = arr.slice(0);
	this.compares = 0;
	this.predefinedIndex = idx;
}

BinSearchDemo.prototype = new DemoAlgorithm ();

BinSearchDemo.prototype.find = function () {
	this.screenplay.push ('_,status,Searching|_,elements,'+this.items.length +'|_,compares,'+this.compares);
	var num = this.items[this.predefinedIndex];
	var found = -1,
	middle = 0,
	left = 0,
	right = this.items.length -1;
	this.screenplay.push ('predefined,'+this.predefinedIndex+'|prevalue,'+num);

	while (found == -1 && left < right) {
		this.screenplay.push ('range,'+left+','+right);
		middle = Math.round ((left+right)/2);
		this.compares++;
		this.screenplay.push ('compare,'+middle+'|_,compares,'+this.compares);

		if (this.items[middle] == num) {
			found = middle;
			break;
		} else if (this.items[middle] > num) {
			right = middle;
		} else {
			left = middle;
		}

		this.compares++;
	}
	
	if (found == -1)
		this.screenplay.push ('notfound');
	else
		this.screenplay.push ('found,'+found);
};

BinSearchDemo.prototype.getInitialState = function () {
	return this.initialItems;
};

BinSearchDemo.prototype.doWork = function () {
	this.screenplay = [];
	this.find ();
//	this.iterativeQuickSort ();
};

BinSearchDemo.prototype.addAgendaArea = function (legendLayer, player) {
		var yOffset = player.stageHeight - player.stageStat;
		var yStep = player.statYStep; 
		legendLayer.add (new Kinetic.Rect ({
			x: 0,
			y: yOffset,
			height: yStep,
			width: yStep,
			fill: player.colorBasic
		}));
		legendLayer.add (new Kinetic.Text ({
			text: 'Out of range',
			fontSize: player.fontSize,
			fontFamily: 'Courier New',
			fill: 'black',
			x: yStep + 5,
			y: yOffset
		}));
		yOffset += yStep;

		legendLayer.add (new Kinetic.Rect ({
			x: 0,
			y: yOffset,
			height: yStep,
			width: yStep,
			fill: player.colorRange
		}));
		legendLayer.add (new Kinetic.Text ({
			text: 'Current range',
			fontSize: player.fontSize,
			fontFamily: 'Courier New',
			fill: 'black',
			x: yStep + 5,
			y: yOffset
		}));
		yOffset += yStep;

		legendLayer.add (new Kinetic.Rect ({
			x: 0,
			y: yOffset,
			height: yStep,
			width: yStep,
			fill: player.colorDorange
		}));
		legendLayer.add (new Kinetic.Text ({
			text: 'Item to be found',
			fontSize: player.fontSize,
			fontFamily: 'Courier New',
			fill: 'black',
			x: yStep + 5,
			y: yOffset
		}));
		yOffset += yStep;

		legendLayer.add (new Kinetic.Rect ({
			x: 0,
			y: yOffset,
			height: yStep,
			width: yStep,
			fill: player.colorPivot
		}));
		legendLayer.add (new Kinetic.Text ({
			text: 'Currently checking',
			fontSize: player.fontSize,
			fontFamily: 'Courier New',
			fill: 'black',
			x: yStep + 5,
			y: yOffset
		}));
		yOffset += yStep;

		legendLayer.add (new Kinetic.Rect ({
			x: 0,
			y: yOffset,
			height: yStep,
			width: yStep,
			fill: player.colorDifferent
		}));
		legendLayer.add (new Kinetic.Text ({
			text: 'Not found',
			fontSize: player.fontSize,
			fontFamily: 'Courier New',
			fill: 'black',
			x: yStep + 5,
			y: yOffset
		}));
		yOffset += yStep;
		
		legendLayer.add (new Kinetic.Rect ({
			x: 0,
			y: yOffset,
			height: yStep,
			width: yStep,
			fill: player.colorFinish
		}));
		legendLayer.add (new Kinetic.Text ({
			text: 'Found',
			fontSize: player.fontSize,
			fontFamily: 'Courier New',
			fill: 'black',
			x: yStep + 5,
			y: yOffset
		}));
};

BinSearchDemo.prototype.reset = function () {
	this.items = this.initialItems.slice (0);
	this.screenplay = null;
	this.compares = 0;
};

BinSearchDemo.prototype.getLabels = function () {
	return this.labels;
};

