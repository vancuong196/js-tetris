/**
 * Declare constants
 */
 const BLOCK_SIZE = 20;
 const WIDTH_TOTAL_BLOCK = 20;
 const HEIGHT_TOTAL_BLOCK = 36;

const I = [
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
	],
	[
		[1, 0, 0],
		[1, 0, 0],
		[1, 0, 0],
	],
	[
		
		[ 0, 0, 0],
		[ 1, 1, 1],
		[ 0, 0, 0],
	],
	[
		[1, 0, 0],
		[1, 0, 0],
		[1, 0, 0],
	]
];

const J = [
	[
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[1, 1, 0],
		[1, 0, 0],
		[1, 0, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 0]
	]
];

const L = [
	[
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[1, 0, 0],
		[1, 0, 0],
		[1, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[1, 0, 0]
	],
	[
		[1, 1, 0],
		[0, 1, 0],
		[0, 1, 0]
	]
];

const O = [
	[
		[ 1, 1, 0],
		[ 1, 1, 0],
		[ 0, 0, 0],
	],
    [
		[ 1, 1, 0],
		[ 1, 1, 0],
		[ 0, 0, 0],
	],
    [
		[ 1, 1, 0],
		[ 1, 1, 0],
		[ 0, 0, 0],
	],
    [
		[ 1, 1, 0],
		[ 1, 1, 0],
		[ 0, 0, 0],
	]

];

const S = [
	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	[
		[1, 0, 0],
		[1, 1, 0],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[0, 1, 1],
		[1, 1, 0]
	],
	[
		[1, 0, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

const T = [
	[
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[1, 0, 0],
		[1, 1, 0],
		[1, 0, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

const Z = [
	[
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 0, 1],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 0],
		[0, 1, 1]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[1, 0, 0]
	]
];

const colors = [
    "1111111",
    "#ff0000",
    "#ff00ff",
    "#ffff00",
    "#000000",
    "#00ff00",
    "#00ffff"
]