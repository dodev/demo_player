window.onload = function () {
	document.getElementById ('fight_button').onclick = fightButtonClick;
};

var fightButtonClick = function () {
	try {
		var num = parseInt (document.getElementById ('number_of_elements').value);
		if (num == null || isNaN (num))
			throw "Enter a number in the 'Number of elements' field!'";
		if  (num < 0 || num > 200)
			throw "The number of elements must be in the range of (0;200)!";

		var rndArr = genRndArr (num);

		var algSel = document.getElementById ('algorithm_select');

		var demoName = algSel.options[algSel.selectedIndex].value;
		var demo = null;

		switch (demoName) {
		case 'qsort':
			demo = new QsortDemo (rndArr);
		break;
		case 'bsort':
			demo = new BubbleSortDemo (rndArr);
		break;
		default:
			throw new Exception ("Unrecognized demo selected");
		break;
		}

		var demoPlayer = new DemoPlayer (demo, 'arena', 700, 550);
		demoPlayer.init ();

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

