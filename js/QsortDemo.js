function QsortDemo (arr) {
	this.items = arr;
	this.iterations = 0;
	this.swaps = 0;
	this.recursiveCalls = 0;
}

QsortDemo.prototype = {
	sort: function () {
		this.notUserFriendlySort (0, this.items.length - 1);
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
		var i = left;
		var j = right;
		var pivot = this.items[Math.ceil ((right + left) / 2)];
		var buf = 0;

		while (i <= j) {
			while (pivot > this.items[i]) i++;
			while (pivot < this.items[j]) j--;

			if (i <= j) {
				buf = this.items[i];
				this.items[i] = this.items[j];
				this.items[j] = buf;
				i++;
				j--;
				this.swaps++;
			}
		}

		return j;
	}
};
