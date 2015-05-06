var map = [
'x-----------x----------',
'-----------------------',
'-----------------------',
'-----------------------',
'-----------------------',
'x-----------x----------',
'-----------------------',
'x-----------x----------',
'-----------------------',
'-----------------------',
'-----------------------',
'x-----------x----------',
'x-----------x-x----x---',
'-----------------------',
'x-----------x-x----x---'
];

var vertices = [];
var factor = 2;

var start, finish;

function parseMap() {

    reset();

    // Read horizontal walls
    for (var i = 0; i < map.length; i++) {
    	for (var j = 0; j < map[i].length; j++) {
    		if (map[i].length != map[0].length)
    			alert("map must be rectangular");
    		if (map[i][j] == 'x' && start[0] == -1) {
    			start = [i, j];
    		}
    		else if (map[i][j] == 'x' && finish[0] == -1) {
    			finish = [i, j];
    			vertices.push(start[1]*factor, -start[0]*factor, 0);
    			vertices.push(finish[1]*factor, -finish[0]*factor, 0);
    			console.log("inserted line at: " + i + ", " + j);
    			reset();
    		}
    	}
    	reset();
    }
    // Read vertical walls
    for (var i = 0; i < map[0].length; i++) {
    	for (var j = 0; j < map.length; j++) {
    		if (map[j][i] == 'x' && start[0] == -1) {
    			start = [j, i];
    		}
    		else if (map[j][i] == 'x' && finish[0] == -1) {
    			finish = [j, i];
    			vertices.push(start[1]*factor, -start[0]*factor, 0);
    			vertices.push(finish[1]*factor, -finish[0]*factor, 0);
    			console.log("inserted line at: " + i + ", " + j);
    			reset();
    		}
    	}
    	reset();
    }

    console.log(vertices);
}

function reset() {
	start = [-1, -1];
	finish = [-1, -1];
}
