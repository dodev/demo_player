function DemoAlgorithm () {
	this.screenplay = null;
	this.finished = false;
}

DemoAlgorithm.prototype = {
	getInitialState: function () {},

	doWork: function () {},

	getScreenplay: function () {
		if (this.screenplay == null)
			this.doWork ();
		return this.screenplay;
	},

	getLabels: function () {},

	addAgendaArea: function (layer, player) {},

	reset: function () {}
};

