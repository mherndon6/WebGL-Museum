/*
Notes:
z is acting inverted. not sure why... so I just inverted the wall positions for now ---- probably just the way i defined camera or something
I think this is a pretty good model, just have to define the rooms based on the vars below, see: http://imgur.com/ecyLIHv
Cycle through rendering rooms by clicking on canvas for now
Half-fixed fullscreen, gotta press f again to leave instead of esc. esc in fullscreen doesnt fire events probably for security
*/


Museum Project

----------------------1------------------------

-Think of exhibits (paintings)					A

----------------------2------------------------

-Bump mapping on walls and tiles on floor
-Lights on ceiling

----------------------3------------------------

-Wall collision
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
