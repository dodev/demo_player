/*var demoArr = [
	new QsortDemo ([2, 12, 7, 4, 5, 10], 'example0'),
	new QsortDemo ([2, 12, 7, 4, 5, 10, 8, 3, 9, 11, 6], 'example1'),
	new QsortDemo ([7, 5, 21, 8, 4, 2, 9, 1, 3, 12, 5, 7, 13, 14, 6, 4, 17, 2, 8, 16, 5], 'example2')
];
*/
window.onload = function () {
/*	for (var i = 0; i< demoArr.length; i++) {
		demoArr[i].initCanvas ();
		demoArr[i].initControls ();
	}
*/
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
			qPlayer.play (); bPlayer.play ();
		};
		document.getElementById ('pause_all').onclick = function () {
			qPlayer.pause (); bPlayer.pause ();
		};
		document.getElementById ('stop_all').onclick = function () {
			qPlayer.stop (); bPlayer.stop ();
		};
		document.getElementById ('interval_select').onchange = function () {
			var interval = parseInt (this.value);
			qPlayer.playInterval = interval;
			bPlayer.playInterval = interval;

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

