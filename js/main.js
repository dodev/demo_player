var demoArr = [
	new QsortDemo ([2, 12, 7, 4, 5, 10, 8, 3, 9, 11, 6], 'example1')
];

window.onload = function () {
	for (var i = 0; i< demoArr.length; i++) {
		demoArr[i].initCanvas ();
		demoArr[i].initControls ();
	}
};

