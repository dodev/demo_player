function BubbleSortDemo (arr) {
	this.labels = 'elements,swaps,status,operation';
	this.items = arr.slice (0);
	this.swaps = 0;
	this.initialItems = arr.slice(0);
}

BubbleSortDemo.prototype = new DemoAlgorithm ();

BubbleSortDemo.prototype.sort = function () {
	this.screenplay.push ('_,status,Unsorted|_,elements,'+this.items.length +'|_,swaps,'+this.swaps);
	var buf = null, ok = false;

	while (!ok) {
		ok = true;
		for (var i = 0; i < this.items.length - 1; i++) {
			if (this.items[i] > this.items[i+1]) {
				ok = false;
				this.screenplay.push ('toswap,'+i+','+(i+1));
				buf = this.items[i];
				this.items[i] = this.items[i+1];
				this.items[i+1] = buf;
				this.swaps++;
				this.screenplay.push ('swap,'+i+','+(i+1)+'|_,swaps,'+this.swaps);

			}
		}
	}
	this.screenplay.push ('_,status,Sorted');
	this.screenplay.push ('finish');
};

BubbleSortDemo.prototype.getInitialState = function () {
	return this.initialItems;
};

BubbleSortDemo.prototype.doWork = function () {
	this.screenplay = [];
	this.sort ();
};

BubbleSortDemo.prototype.addAgendaArea = function (legendLayer, player) {
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
			text: 'Not in sorting',
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
			text: 'To be swapped',
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
			text: 'Array sorted',
			fontSize: player.fontSize,
			fontFamily: 'Courier New',
			textFill: 'black',
			x: yStep + 5,
			y: yOffset
		}));
};

BubbleSortDemo.prototype.reset = function () {
	this.items = this.initialItems.slice (0);
	this.screenplay = null;
	this.swaps = 0;
};

BubbleSortDemo.prototype.getLabels = function () {
	return this.labels;
};

