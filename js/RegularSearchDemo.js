function RegularSearchDemo (arr, idx) {
	this.labels = 'elements,compares,status,operation';
	this.items = arr.slice (0);
	this.compares = 0;
	this.initialItems = arr.slice(0);
	this.predefinedIndex = idx;
}

RegularSearchDemo.prototype = new DemoAlgorithm ();

RegularSearchDemo.prototype.find = function () {
	this.screenplay.push ('_,status,Searching|_,elements,'+this.items.length +'|_,compares,'+this.compares);
	var num = this.items[this.predefinedIndex];
	var found = -1;
	this.screenplay.push ('predefined,'+this.predefinedIndex+'|prevalue,'+num);

	for (var i = 0; i < this.items.length; i++) {
		this.compares++;
		this.screenplay.push ('compare,'+i+'|range,0,'+i+'|_,compares,'+this.compares);
		if (this.items[i] == num) {
			found = i;
			break;
		}
	}
	
	if (found == -1)
		this.screenplay.push ('notfound');
	else
		this.screenplay.push ('found,'+found);

};

RegularSearchDemo.prototype.getInitialState = function () {
	return this.initialItems;
};

RegularSearchDemo.prototype.doWork = function () {
	this.screenplay = [];
	this.find ();
};

RegularSearchDemo.prototype.addAgendaArea = function (legendLayer, player) {
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
			text: 'Not reached',
			fontSize: player.fontSize,
			fontFamily: 'Courier New',
			textFill: 'black',
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
			text: 'Checked',
			fontSize: player.fontSize,
			fontFamily: 'Courier New',
			textFill: 'black',
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
			textFill: 'black',
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
			textFill: 'black',
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
			textFill: 'black',
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
			textFill: 'black',
			x: yStep + 5,
			y: yOffset
		}));
};

RegularSearchDemo.prototype.reset = function () {
	//this.items = this.initialItems.slice (0);
	this.screenplay = null;
	this.compares = 0;
};

RegularSearchDemo.prototype.getLabels = function () {
	return this.labels;
};

