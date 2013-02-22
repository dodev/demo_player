function DemoPlayer (alg, containerId, width, height) {
	if (!alg instanceof DemoAlgorithm)
		throw 'Error: the player requires an instence of a DemoAlgorithm to build the animation.';
	
	this.algorithm = alg;
	
	this.stageWidth = width;
	this.stageHeight = height;
	this.stageStat = 150;
	this.padding = 20;
	this.maxHeight = (this.stageHeight - 2*this.padding - this.stageStat);

	this.fontSize = 18;
	this.lineHeight = 1.2;
	this.statLabelsX = 300;
	this.statValuesX = 450;
	this.statYStep = Math.round (this.fontSize * this.lineHeight);
	this.fontFamily = 'Courier New';
	this.labelDefault = '-';
	this.labels = {};

	this.containerId = containerId;

	this.colorBasic = 'grey';
	this.colorPivot = 'green';
	this.colorDifferent = 'red';
	this.colorRange = 'lawngreen';
	this.colorFinish = 'yellowgreen';

	this.timer = null;
	this.currentlyPlaying = false;
}

DemoPlayer.prototype = {
	init: function () {
		// init the stage
		this.stage = new Kinetic.Stage ({
			container: this.containerId,
			width: this.stageWidth, 
			height: this.stageHeight
		});
		
		this.mainLayer = new Kinetic.Layer ();

		// initializing the major areas on the canvass
		this.addBarsArea (this.mainLayer, this.algorithm.getInitialState ());
		this.addStatusArea (this.mainLayer);
		this.stage.add (this.mainLayer);
		
		// add a legend layer, which won't change on reset
		// the items in it are pretty static
		var legendLayer = new Kinetic.Layer ();
		this.algorithm.addAgendaArea (legendLayer, this);
		this.stage.add (legendLayer);
		
		this.playInterval = 500;
		this.screenplay = this.algorithm.getScreenplay ();
		this.currentScene = 0;
		this.animationFinished = false;

		// init the animation object
		this.animationFinished == false;
		this.animation = new Kinetic.Animation (animationIter, this.mainLayer);
		this.animation.caller = this;
		this.animation.buf = {};

		this.initControls ();
	},

	reset: function () {
		document.getElementById (this.containerId).innerHTML = '';
		this.algorithm.reset();
		this.init ();
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
		optionBuf = document.createElement ('option');
		optionBuf.innerHTML = '100';
		intervalSelect.appendChild (optionBuf);
		optionBuf = document.createElement ('option');
		optionBuf.innerHTML = '50';
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
		this.creator.setPlayInterval (parseInt (this.options[this.selectedIndex].value));
	},
	setPlayInterval: function (interval) {
		if (typeof interval == 'undefined')
			return;

		this.playInterval = interval;
		if (this.currentlyPlaying) {
			this.pause ();
			this.play ();
		}
	},

	//
	// end of handlers
	//

	addBarsArea: function (layer, arr) {
		var maxnum = -Infinity;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] > maxnum)
				maxnum = arr[i];
		}
		this.barWidth = Math.floor((this.stageWidth - 2*this.padding) / (2 * arr.length - 1));
		var xoffset = this.padding;
		this.barItems = [];
		for (var i = 0; i < arr.length; i++) {
			var barHeight = Math.floor ((arr[i] / maxnum) * this.maxHeight);
			
			this.barItems[i] = new Kinetic.Rect ( {
					x: xoffset,
					y: this.padding + this.maxHeight - barHeight,
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
		var lbls = this.algorithm.getLabels ().split (',');
		var lblName = '';

		for (var i = 0; i < lbls.length; i++) {
			lblName = lbls[i].toString ();
			layer.add (new Kinetic.Text ({
				text: lblName + ':',
				fontSize: this.fontSize,
				fontFamily: this.fontFamily,
				textFill: 'black',
				x: this.statLabelsX,
				y: yOffset
			}));
			this.labels[lblName] = new Kinetic.Text ({
				text: this.labelDefault,
				fontSize: this.fontSize,
				fontFamily: this.fontFamily,
				textFill: 'black',
				x: this.statValuesX,
				y: yOffset
			});
			layer.add (this.labels[lblName]);
			yOffset += this.statYStep;
		}
	},

	setLabel: function (name, value) {
		if (this.labels.hasOwnProperty (name))
			this.labels[name].setText (value);
	},

	play: function (interval) {

		if (this.animationFinished)
			return;

		if (interval != undefined)
			this.playInterval = interval;

		//this.animation.past = 0;	
		//this.animation.start ();
		var player = this;
		this.timer = setInterval (function () {
				player.animation.start ();
				player.animation.stop ();
			}, 
			this.playInterval);
		this.currentlyPlaying = true;
	},

	animationWorker: function () {
		this.animation.start ();
		this.animation.stop ()
	},

	stop: function () {
		clearInterval(this.timer);
		this.animation.stop ();
		this.reset ();
		this.currentlyPlaying = false;
	},

	pause: function () {
		clearInterval(this.timer);
		this.animation.stop ();
		this.currentlyPlaying = false;
	}
};

var animationIter = function (frame) {
	/*if (frame.time - this.past < this.caller.playInterval)
		return;
	
	this.past = frame.time;*/

	if (this.caller.screenplay.length-1 < this.caller.currentScene) {
		// reached the end of the screenplay
		// stop the animation
		this.caller.pause ();
		this.caller.currentScene = 0;
		this.caller.animationFinished = true;
		return;
	}

	// get the current scene's insutructions
	var instructions = this.caller.screenplay[this.caller.currentScene].split('|');
	
	// autofill the operation status label with the first instruction
	this.caller.setLabel ('operation', instructions[0]);

	// set the other status labels
	for (var i = 0; i < instructions.length; i++) {
		//get the instruction and arguments for the bar items
		var args = instructions[i].split(',');
		
		// echo the operation to the stat area
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
				}
			break;

			case 'pivot': 
				this.buf.currPivot = parseInt (args[1]);
			break;

			case 'toswap':
				var arg1 = parseInt (args[1]);
				var arg2 = parseInt (args[2]);
					
				this.buf.toSwap = [arg1, arg2];
			break;

			case 'range':
				this.buf.range = [parseInt(args[1]),parseInt(args[2])];
				this.buf.currPivot = null;
			break;

			case 'finish':
				this.buf.finish = true;
			break;

			case '_':
				this.caller.setLabel (args[1], args[2]);
			break;

			default:
			break;
		}
	}


	refreshBars (this.caller, this.buf);
	// move to the next scene
	this.caller.currentScene++;
};

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

