function QsortDemo (arr, containerId) {
	this.items = arr;
	this.initialArr = arr.slice (0); // copy the array by value
	this.sorted = false;
	this.iterations = 0;
	this.swaps = 0;
	this.recursiveCalls = 0;

	this.stageWidth = 800;
	this.stageHeight = 500;
	this.stageStat = 100;
	this.bufZone = 20;
	this.barWidth = Math.floor((this.stageWidth - 2*this.bufZone) / (2 * arr.length - 1));
	this.maxHeight = (this.stageHeight - 2*this.bufZone - this.stageStat);

	this.fontSize = 18;
	this.statLabelsX = 300;
	this.statValuesX = 450;
	this.statYStep = Math.round (this.stageStat / 4);
	this.statValStatus = null;
	this.statValElements = null;
	this.statValSwaps = null;
	this.statValOperation = null;

	this.controlDiv = null;
	this.containerId = containerId;
	this.stage = null;
	this.mainLayer = null;
	this.barItems = null;
	this.animation = null;

	this.playInterval = 500;
	this.screenplay = [];
	this.currentScene = 0;
	this.animationFinished = false;

	this.colorBasic = 'grey';
	this.colorPivot = 'green';
	this.colorDifferent = 'red';
	this.colorRange = 'lawngreen';
	this.colorFinish = 'yellowgreen';
}

QsortDemo.prototype = {
	//
	// quick sort implementation
	//
	sort: function () {
		this.screenplay = [];
		this.currentScene = 0;
		if (this.sorted == false)
			this.notUserFriendlySort (0, this.items.length - 1);
		this.sorted = true;
		this.screenplay.push ('finish');
	},

	notUserFriendlySort: function (left, right) {
		var pIndex = 0;

		if (right > left) {
			pIndex = this.partition (left, right);
			this.notUserFriendlySort (left, pIndex);
			this.recursiveCalls++;
			this.notUserFriendlySort (pIndex+1, right);
			this.recursiveCalls++;
		}
	},

	partition: function (left, right) {
		this.screenplay.push ('range,'+left+','+right);
		var i = left;
		var j = right;
		var pIdx = Math.floor ((right + left) / 2);
		var pivot = this.items[pIdx];
		this.screenplay.push ('pivot,'+pIdx);
		var buf = 0;

		while (i < j) {
			while (pivot > this.items[i]) i++;
			while (pivot < this.items[j]) j--;

			if (i < j) {
				this.screenplay.push ('toswap,'+i+','+j);
				buf = this.items[i];
				this.items[i] = this.items[j];
				this.items[j] = buf;
				this.screenplay.push ('swap,'+i+','+j);
				i++;
				j--;
				this.swaps++;
			}
		}

		return j;
	},
	//
	// end of quick sort implementation
	//

	reset: function () {
		this.items = this.initialArr.slice (0);
		this.swaps = 0;
		this.sorted = false;
		this.recursiveCalls = 0;
		this.screenplay = [];
		this.currentScene = 0;

		this.mainLayer.remove ();
		this.mainLayer = new Kinetic.Layer ();
		this.addBarsArea (this.mainLayer);
		this.addStatusArea (this.mainLayer);
		this.stage.add (this.mainLayer);
		this.animation = new Kinetic.Animation (animationIter, this.mainLayer);
		this.animation.caller = this;
		this.animation.buf = {};
		this.animationFinished = false;
	},
	
	initControls: function () {		
		var controlDiv = document.createElement ('div');

		var startButton = document.createElement ('button');
		startButton.textContent = 'Start';
		startButton.creator = this;
		startButton.onclick = this.startButtonClick;
		controlDiv.appendChild (startButton);

		var pauseButton = document.createElement ('button');
		pauseButton.textContent = 'Pause';
		pauseButton.creator = this;
		pauseButton.onclick = this.pauseButtonClick;
		controlDiv.appendChild (pauseButton);

		var stopButton = document.createElement ('button');
		stopButton.textContent = 'Stop/Reset';
		stopButton.creator = this;
		stopButton.onclick = this.stopButtonClick;
		controlDiv.appendChild (stopButton);

		var intervalLabel = document.createElement ('span');
		intervalLabel.textContent = 'Play interval(ms):';
		controlDiv.appendChild (intervalLabel);
		
		var intervalSelect = document.createElement ('select');
		var optionBuf = document.createElement ('option');
		optionBuf.innerHTML = '1500';
		intervalSelect.appendChild (optionBuf);
		optionBuf = document.createElement ('option');
		optionBuf.innerHTML = '1000';
		optionBuf.selected = true;
		intervalSelect.appendChild (optionBuf);
		optionBuf = document.createElement ('option');
		optionBuf.innerHTML = '500';
		intervalSelect.appendChild (optionBuf);
		optionBuf = document.createElement ('option');
		optionBuf.innerHTML = '200';
		intervalSelect.appendChild (optionBuf);
		intervalSelect.creator = this;
		intervalSelect.onchange = this.intervalSelectChange;
		controlDiv.appendChild (intervalSelect);

		document.getElementById (this.containerId).appendChild (controlDiv);
	},

	//
	// handlers
	//
	startButtonClick: function () {
		this.creator.play ();
	},

	pauseButtonClick: function () {
		this.creator.pause ();
	},
	stopButtonClick: function () {
		this.creator.stop ();
	},
	intervalSelectChange: function () {
		this.creator.playInterval = parseInt (this.options[this.selectedIndex].value);
	},
	//
	// end of handlers
	//

	initCanvas: function () {
		// init the stage
		this.stage = new Kinetic.Stage ({
			container: this.containerId,
			width: this.stageWidth, 
			height: this.stageHeight
		});
		
		this.mainLayer = new Kinetic.Layer ();

		// initializing the major areas on the canvass
		this.addBarsArea (this.mainLayer);
		this.addStatusArea (this.mainLayer);
		this.stage.add (this.mainLayer);
		
		// add a legend layer, which won't change on reset
		// the items in it are pretty static
		var legendLayer = new Kinetic.Layer ();
		this.addLegendArea (legendLayer);
		this.stage.add (legendLayer);
		
		// init the animation object
		this.animation = new Kinetic.Animation (animationIter, this.mainLayer);
		this.animation.caller = this;
		this.animation.buf = {};
	},

	addBarsArea: function (layer) {
		var maxnum = -Infinity;
		for (var i = 0; i < this.items.length; i++) {
			if (this.items[i] > maxnum)
				maxnum = this.items[i];
		}
		var xoffset = this.bufZone;
		this.barItems = [];
		for (var i = 0; i < this.items.length; i++) {
			var barHeight = Math.floor ((this.items[i] / maxnum) * this.maxHeight);
			
			this.barItems[i] = new Kinetic.Rect ( {
					x: xoffset,
					y: this.bufZone + this.maxHeight - barHeight,
					height: barHeight,
					width: this.barWidth,
					fill: this.colorBasic
				} );
			layer.add (this.barItems[i]);

			xoffset += 2*this.barWidth;
		}
	},

	addStatusArea: function (layer) {
		var yOffset = this.stageHeight - this.stageStat;
		layer.add (new Kinetic.Text ({
			text: 'Status:',
			fontSize: this.fontSize,
			fontFamily: 'Courier New',
			textFill: 'black',
			x: this.statLabelsX,
			y: yOffset
		}));
		this.statValStatus = new Kinetic.Text ({
			text: (this.sorted? 'Sorted' : 'Unsorted'),
			fontSize: this.fontSize,
			fontFamily: 'Courier New',
			textFill: 'black',
			x: this.statValuesX,
			y: yOffset
		});
		layer.add (this.statValStatus);

		yOffset += this.statYStep;
		layer.add (new Kinetic.Text ({
			text: 'Elements:',
			fontSize: this.fontSize,
			fontFamily: 'Courier New',
			textFill: 'black',
			x: this.statLabelsX,
			y: yOffset
		}));
		this.statValElements = new Kinetic.Text ({
			text: this.items.length.toString (),
			fontSize: this.fontSize,
			fontFamily: 'Courier New',
			textFill: 'black',
			x: this.statValuesX,
			y: yOffset
		});
		layer.add (this.statValElements);

		yOffset += this.statYStep;
		layer.add (new Kinetic.Text ({
			text: 'Swaps:',
			fontSize: this.fontSize,
			fontFamily: 'Courier New',
			textFill: 'black',
			x: this.statLabelsX,
			y: yOffset
		}));
		this.statValSwaps = new Kinetic.Text ({
			text: this.swaps.toString (),
			fontSize: this.fontSize,
			fontFamily: 'Courier New',
			textFill: 'black',
			x: this.statValuesX,
			y: yOffset
		});
		layer.add (this.statValSwaps);

		yOffset += this.statYStep;
		layer.add (new Kinetic.Text ({
			text: 'Operation:',
			fontSize: this.fontSize,
			fontFamily: 'Courier New',
			textFill: 'black',
			x: this.statLabelsX,
			y: yOffset
		}));
		this.statValOperation = new Kinetic.Text ({
			text: '-',
			fontSize: this.fontSize,
			fontFamily: 'Courier New',
			textFill: 'black',
			x: this.statValuesX,
			y: yOffset
		});
		layer.add (this.statValOperation);
	},

	addLegendArea: function (legendLayer) {
		var yOffset = this.stageHeight - this.stageStat;
		var yStep = Math.round (this.stageStat / 5); // five bar colors
		legendLayer.add (new Kinetic.Rect ({
			x: 0,
			y: yOffset,
			height: yStep,
			width: yStep,
			fill: this.colorBasic
		}));
		legendLayer.add (new Kinetic.Text ({
			text: 'Not in sorting',
			fontSize: this.fontSize,
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
			fill: this.colorRange
		}));
		legendLayer.add (new Kinetic.Text ({
			text: 'Current range',
			fontSize: this.fontSize,
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
			fill: this.colorPivot
		}));
		legendLayer.add (new Kinetic.Text ({
			text: 'Current pivot',
			fontSize: this.fontSize,
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
			fill: this.colorDifferent
		}));
		legendLayer.add (new Kinetic.Text ({
			text: 'To be swapped',
			fontSize: this.fontSize,
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
			fill: this.colorFinish
		}));
		legendLayer.add (new Kinetic.Text ({
			text: 'Array sorted',
			fontSize: this.fontSize,
			fontFamily: 'Courier New',
			textFill: 'black',
			x: yStep + 5,
			y: yOffset
		}));
	},

	play: function (interval) {
		if (!this.sorted)
			this.sort ();

		if (this.animationFinished)
			return;

		if (interval != undefined)
			this.playInterval = interval;

		this.animation.past = 0;	
		this.animation.start ();	
	},

	stop: function () {
		this.animation.stop ();
		this.reset ();
	},

	pause: function () {
		this.animation.stop ();
	},

};

var animationIter = function (frame) {
	if (frame.time - this.past < this.caller.playInterval)
		return;
	
	this.past = frame.time;

	if (this.caller.screenplay.length-1 < this.caller.currentScene) {
		// reached the end of the screenplay
		// stop the animation
		this.caller.currentScene = 0;
		this.caller.animationFinished = true;
		this.stop ();
		return;
	}
	// parse the scene and the arguments
	var args = this.caller.screenplay[this.caller.currentScene].split(',');

	// echo the operation to the stat area
	this.caller.statValOperation.setText (args.toString ());
	switch (args[0]) {
		case 'swap':
			if (args[1] != undefined && args[2] != undefined) {
				var bar1 = this.caller.barItems[args[1]], bar2 = this.caller.barItems[args[2]];
				var X1 = bar1.getX ();
				bar1.setX (bar2.getX ());
				bar2.setX (X1);
				// swap the bar items, too
				this.caller.barItems[args[1]] = bar2;
				this.caller.barItems[args[2]] = bar1;
				if (this.buf.swaps == undefined)
					this.buf.swaps = 0;
				this.buf.swaps++;

				this.caller.statValSwaps.setText (this.buf.swaps.toString ());
			}
		break;

		case 'pivot': 
			this.buf.currPivot = parseInt (args[1]);
		break;

		case 'toswap':
			this.buf.toSwap = [parseInt(args[1]),parseInt(args[2])];
		break;

		case 'range':
			this.buf.range = [parseInt(args[1]),parseInt(args[2])];
			this.buf.currPivot = null;
		break;

		case 'finish':
			this.buf.finish = true;
			this.caller.statValStatus.setText ('Sorted');
		break;

		default:
		break;
	}

	refreshBars (this.caller, this.buf);
	// move to the next scene
	this.caller.currentScene++;
}

var refreshBars = function (demo, buf) {
	if (buf.finish != undefined && buf.finish == true) {
		for (var i = 0; i < demo.barItems.length; i++)
			demo.barItems[i].setFill (demo.colorFinish);
		return;
	}	
	for (var i = 0; i < demo.barItems.length; i++) {
		demo.barItems[i].setFill (demo.colorBasic);
	}

	if (buf.range != undefined) {
		for (var i = buf.range[0]; i <= buf.range[1]; i++)
			demo.barItems[i].setFill (demo.colorRange);
	}

	if (buf.currPivot != undefined && buf.currPivot != null)
		demo.barItems[buf.currPivot].setFill (demo.colorPivot);

	if (buf.toSwap != undefined && buf.toSwap != null) {
		demo.barItems[buf.toSwap[0]].setFill (demo.colorDifferent);
		demo.barItems[buf.toSwap[1]].setFill (demo.colorDifferent);
		buf.toSwap = null;
	}
	
};

