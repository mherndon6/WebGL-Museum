    UCLA - CS 174A Spring 2015 Final Project

Contributors:
    Bartholomew Elliott
    Mitchell Herndon
    Austin Pineda

After cloning the repo, make sure to run chrome with option
--allow-file-access-from-files or use firefox (lags a bit worse).
Since there are so many textures, the project is fairly graphics-intensive. Some older laptops have a harder time running it smoothly.

For our term project, we created a museum in WebGL. The museum incorporates all of the basic topics from the first half of the course, including:
    -Transformations
    -Texture mapping
    -Lighting
    -Culling
Our advanced topic, collision detection, is implemented in two ways. First, we detect collisions between the player and the walls of the museum. If the wall happens to be a door, it can be entered. If there is no door there, the player moves against the wall according to their azimuth. Second, we detect collisions between the player and the museum goer. This fellow walks randomly between the paintings in each exhibit and contemplates them for a few seconds each. He rudely shoves the player out of his way to get to his destination.

Enjoy! A map of the museum can be found below.
```
    __Stairs_
    |       |2/4
3/6 | Hall  |
    |_     _|1/5
      Shrine

Room 1 Neoclassical:
        Oath of the Horatii - Jacques-Louis David
        Napoleon I on his Imperial Throne - Jean-Auguste-Dominique Ingres
        The Death of General Wolfe - Benjamin West

Room 2 Landscapes:
        Ulysses deriding Polyphemus - J.M.W. Turner
        XP wallpaper - Charles O'Rear
        Moonlit landscape - Rembrandt van Rijn

Room 3 Famous:
        A Sunday Afternoon on the Island of La Grande Jatte - Georges-Pierre Seurat
        Girl with a Pearl Earring - Johannes Vermeer
        Starry Night - Van Gogh
        The Mona Lisa - Leonardo da Vinci
        Ecce Homo - Elias Garcia Martinez
        
Room 4 Landscapes:
        A View of Het Steen in the Early Morning - Peter Paul Rubens
        Sunset over a Forest Lake - Peder Monsted
        Sleigh Ride on a Sunny Winter Day - Peder Monsted

Room 5 Light:
        The Fall of Phaeton - Peter Paul Rubens
        Nocturne: Blue and Gold – Old Battersea Bridge - James Whistler
        Impression, Sunrise - Claude Monet

Room 6 Dark:
        The Weeping Woman - Pablo Picasso
        Snow Storm - J.M.W. Turner
        The Scream - Edvard Munch
        The Last Day of Pompeii - Karl Briullov
```
