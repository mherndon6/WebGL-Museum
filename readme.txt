Notes:
Map: http://imgur.com/ecyLIHv

To add a texture, make an object in textures.js and add an img tag in the html

Make sure to run chrome with option --allow-file-access-from-files

Trying to add single source lighting to each room - need to add a normal buffer & calculate normals for each of the get__Vertices() functions, return a 3-item list with [vertices, texVertices, normVertices]. Calculating normals should be simple.

--------------------TODO-----------------------

-Think of exhibits (paintings)
-Bump mapping on walls and tiles on floor
-Frame pictures
-Light geometries on ceiling
-Lighting
-Front plaque
-Painting info (?)
-Music
-Sounds
-Taking stairs now changes lobby to shrine room - need to make rooms 4-6, add to toggleFloor()

--------------------Ideas----------------------

	Mirror
		show self as smiley face
	Themed rooms w/ matching music
		fade into idle song in hallway

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

1 (small) Neoclassical:
    Walls: white
    Floor:
    Song: Bach Harpsichord
    Paintings:
        Oath of the Horatii - Jacques-Louis David
        Napoleon I on his Imperial Throne - Ingres
        The Death of General Wolfe - Benjamin West

2 (small) Landscapes:
    Walls:
    Floor:
    Song:
    Paintings:
        Ulysses deriding Polyphemus - J.M.W. Turner
        XP theme
        Moonlit landscape - Rembrandt

3 (big) Famous:
    Walls: white
    Floor:
    Song: 
    Paintings:
        Starry Night - Van Gogh
        The Mona Lisa - Leonardo da Vinci
        Ecce Mono - Elias Garcia Martinez
        

Upper Hallway:
    Walls:
    Floor:
    Song:

4 (small):
    Walls:
    Floor:
    Song:
    Paintings: 

5 (small) Light:
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
        Snow Storm - J.M.W. Turner
        The Scream - Edvard Munch
        No. 5, 1948 - Jackson Pollock
        The Last Day of Pompeii - Karl Briullov

Shrine:
    Walls:
    Floor:
    Song: Also Sprach Zarathustra - Richard Strauss
    Light: Spotlight
    Painting: Scott


cd C:/Program Files (x86)/Google/Chrome/Application
start chrome.exe --allow-file-access-from-files
