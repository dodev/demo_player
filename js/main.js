var demoArr = [
	new QsortDemo ([2, 12, 7, 4, 5, 10], 'example0'),
	new QsortDemo ([2, 12, 7, 4, 5, 10, 8, 3, 9, 11, 6], 'example1'),
	new QsortDemo ([7, 5, 21, 8, 4, 2, 9, 1, 3, 12, 5, 7, 13, 14, 6, 4, 17, 2, 8, 16, 5], 'example2')
];

window.onload = function () {
	for (var i = 0; i< demoArr.length; i++) {
		demoArr[i].initCanvas ();
		demoArr[i].initControls ();
	}
};

