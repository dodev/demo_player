window.onload = function () {
	document.getElementById ('fight_button').onclick = fightButtonClick;
};

var fightButtonClick = function () {
	try {
		var num = parseInt (document.getElementById ('number_of_elements').value);
		if (num == null || isNaN (num))
			throw "Enter a number in the 'Number of elements' field!'";
		if  (num < 0 || num > 200)
			throw "The number of elements must be in the range of (0;50)!";

		// TODO: add opponent input parsing

		var rndArr = genRndArr (num);

		var qsortDemo = new QsortDemo (rndArr);
		var qPlayer = new DemoPlayer (qsortDemo, 'red_corner', 700, 550);
		var bsortDemo = new BubbleSortDemo (rndArr);
		var bPlayer = new DemoPlayer (bsortDemo, 'blue_corner', 700, 550);
		qPlayer.init ();
		bPlayer.init ();
		document.getElementById ('start_all').onclick = function () {
			if (qPlayer.currentlyPlaying || bPlayer.currentlyPlaying)
					return ;
			setTimeout(function () {  qPlayer.play(); }, 10);
			setTimeout(function () {  bPlayer.play (); }, 20);
		};
		document.getElementById ('pause_all').onclick = function () {
			qPlayer.pause (); bPlayer.pause ();
		};
		document.getElementById ('stop_all').onclick = function () {
			qPlayer.stop (); bPlayer.stop ();
		};
		document.getElementById ('interval_select').onchange = function () {
			var interval = parseInt (this.value);
			setTimeout (function () { qPlayer.setPlayInterval(interval) }, 10);
			setTimeout (function () { bPlayer.setPlayInterval(interval) }, 50);

		};

	} catch (e) {
		window.alert ('ERROR: '+e.toString ());
	}
};

var genRndArr = function (num) {
	var arr = [];
	var i = 0;
	var buf;
	while (i < num) {
		buf = Math.round (Math.random () * 100);
		if (buf != 0)
			arr[i++] = buf;
	}
		
	return arr;
};

