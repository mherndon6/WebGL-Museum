/*
Notes:
z is acting inverted. not sure why... so I just inverted the wall positions for now ---- probably just the way i defined camera or something
I think this is a pretty good model, just have to define the rooms based on the vars below, see: http://imgur.com/ecyLIHv
Cycle through rendering rooms by clicking on canvas for now
Uncomment line 4 of museum.js for horizontal mouse movement. Affects azimuth, should feel less clunky when combined with fullscreen/pointerlock
*/


Museum Project

----------------------1------------------------

-Design layout & plot vertices in WebGL			M/B
-Navigation (add mouse movement)				M
-Think of exhibits (paintings)					A

----------------------2------------------------

-Bump mapping on walls and tiles on floor
-Lights on ceiling

----------------------3------------------------

-Wall collision
-Some physics

--------------------Ideas----------------------

	Scott shrine
		HUGE room
		spotlights
		Strauss - Zarathustra song
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


1 (small):


2 (small):


3 (big):

Upper Hallway:

4 (small):


5 (small):


6 (big):


Shrine: