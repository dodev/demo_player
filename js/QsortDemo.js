function QsortDemo (arr) {
	this.labels = 'elements,swaps,status,operation';
	this.items = arr.slice (0);
	this.initialItems = arr.slice(0);
	this.swaps = 0;
}

QsortDemo.prototype = new DemoAlgorithm ();
QsortDemo.prototype.sort =  function () {
		this.screenplay = [];
		this.currentScene = 0;
		if (this.sorted == false)
			this.notUserFriendlySort (0, this.items.length - 1);
		this.sorted = true;
		this.screenplay.push ('finish');
	};

QsortDemo.prototype.notUserFriendlySort = function (left, right) {
		var pIndex = 0;

		if (right > left) {
			pIndex = this.partition (left, right);
			this.notUserFriendlySort (left, pIndex);
			this.recursiveCalls++;
			this.notUserFriendlySort (pIndex + 1, right);
			this.recursiveCalls++;
		}
	};

QsortDemo.prototype.partition = function (left, right) {
		this.screenplay.push ('range,'+left+','+right);
		var i = left;
		var j = right;
		var pIdx = Math.floor ((right + left) / 2);
		var pivot = this.items[pIdx];
		this.screenplay.push ('pivot,'+pIdx);
		var buf = 0;

		while (i <= j ) {
			while (pivot > this.items[i]) i++;
			while (pivot < this.items[j]) j--;

			if (i <= j) {
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
	};

QsortDemo.prototype.iterativeQuickSort = function () {
	this.screenplay.push ('_,status,Unsorted|_,elements,'+this.items.length +'|_,swaps,'+this.swaps);

	var left, right, i, j,
	pIndex, pivot, buf,
	stack = [];
	stack.push ([0, this.items.length-1]);

	while (stack.length > 0) {
		buf = stack.pop ();
		left = buf[0];
		right = buf[1];

		while (left < right) {
			this.screenplay.push ('range,'+left+','+right);
			pIndex = Math.floor ((left + right) / 2);
			this.screenplay.push ('pivot,'+pIndex);
			pivot = this.items[pIndex];
			i = left;
			j = right;

			while (i <= j) {
				while (pivot > this.items[i]) i++;
				while (pivot < this.items[j]) j--;

				if (i <= j) {
					if (this.items[i] != this.items[j]) {
						this.screenplay.push ('toswap,'+i+','+j);
						buf = this.items[i];
						this.items[i] = this.items[j];
						this.items[j] = buf;
						this.swaps++;
						this.screenplay.push ('swap,'+i+','+j+'|_,swaps,'+this.swaps.toString());
					}
					i++;
					j--;
				}
			}
			if (j - left < right - i) {
				if (i < right)
					stack.push ([i, right]);
				right = j;
			} else {
				if (left < j)
					stack.push ([left, j]);
				left = i;
			}
		}
	}

	this.screenplay.push ('_,status,Sorted');
	this.screenplay.push ('finish');
};

QsortDemo.prototype.getInitialState = function () {
	return this.initialItems;
};

QsortDemo.prototype.doWork = function () {
	this.screenplay = [];
	this.iterativeQuickSort ();
};

QsortDemo.prototype.addAgendaArea = function (legendLayer, player) {
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
			fill: player.colorPivot
		}));
		legendLayer.add (new Kinetic.Text ({
			text: 'Current pivot',
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
			text: 'To be swapped',
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
			text: 'Array sorted',
			fontSize: player.fontSize,
			fontFamily: 'Courier New',
			fill: 'black',
			x: yStep + 5,
			y: yOffset
		}));
};

QsortDemo.prototype.reset = function () {
	this.items = this.initialItems.slice (0);
	this.screenplay = null;
	this.swaps = 0;
};

QsortDemo.prototype.getLabels = function () {
	return this.labels;
};

