/*
Notes:
http://imgur.com/ecyLIHv
Cycle through rooms by clicking
Walking through doors works, but not perfectly. Doesn't always register, sometimes have to shove your way in
God navigation with ijkl, wasd only works when inside bounds of walls
*/


Museum Project

----------------------1------------------------

-Think of exhibits (paintings)					A

----------------------2------------------------

-Bump mapping on walls and tiles on floor
-Lights on ceiling

----------------------3------------------------

-Wall collision
-Walk through doors, render right rooms
-Texture map paintings
-Some physics

--------------------Ideas----------------------

	Mirror
		show self as smiley face
	Themed rooms w/ matching music
		fade into idle song in hallway
	Render only the current room
		make doors black voids or red curtains

-----------------Rooms-------------------------
	__Stairs_
	|  		|2/4
3/6 | Hall 	|
	|_ 	   _|1/5
	  Shrine

Hallway:
    Walls:
    Floor:
    Song:

1 (small) Baroque:
    Walls: white
    Floor:
    Song: Bach Harpsichord
    Paintings:
        The Night Watch - Rembrandt

2 (small) Landscapes:
    Walls:
    Floor:
    Song:
    Paintings:
        Ulysses deriding Polyphemus - J.M.W. Turner

3 (big) Famous:
    Walls: white
    Floor:
    Song: 
    Paintings:
        Starry Night - Van Gogh
        The School of Athens - Raphael
        The Mona Lisa - Leonardo da Vinci
        


Upper Hallway:
    Walls:
    Floor:
    Song:

4 (small):
    Walls:
    Floor:
    Song:
    Paintings: 

5 (small):
    Walls:
    Floor:
    Song:
    Paintings: 

6 (big) Dark:
    Walls: pyramids sticking out
    Floor: some weird pattern
    Song: 
    Paintings:
        The Weeping Woman - Picasso
        Hannibal Crossing the Alps - J.M.W. Turner
        The Scream - Edvard Munch
        No. 5, 1948 - Jackson Pollock

Shrine:
    Walls:
    Floor:
    Song: Also Sprach Zarathustra - Richard Strauss
    Light: Spotlight
    Painting: Scott
