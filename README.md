# Lex Cells | A Sim/Game of Genetics and Evolution

**Note: Early pre-release, under major construction**

*Code base is presently experimentaly and definitely subject to change.*
<p align="center"><img src="./readme_imgs/demo2.gif" alt="Base" width="500"></p>

## Overview
A simulation of evolution, mutation, and survival for single-celled organisms.
Every cell's sole purpose is to gain enough energy from its environment to 
undergo division.  Cells are guided by their genes, with each gene offering
unique advantages in environment.

Inspired by project Biogenesis.

## Features

**Under Construction**
  * Cell / Gene Editor
  * World Editor
  * Custom gene creator
  * Competetive online site that stores user-profiles/worlds.  
  * Users can share their worlds and records.
  * Site-wide world that will inject organisms created by random users in
    a constant, competitive, spectator environment.
  * Scoreboard for categories like, "most offspring",
    "longest-lived", "most infected", "most killed", "most eaten", and several
    more.

## Cells
Cells will be driven with the sole purpose of reproduction.  Each gene, of which
there are currently 8, will provide a unique benefit, attribute bonus, or means
of absorbing energy from the environment.  Once a cell has enough energy, it
will divide without intervention.

Cells can have between 2 and 16 *genes*, each of which has a *length* factor.
The length factor will determine the effectiveness of that gene.  Multiple 
duplicate genes are possible, with the total *length* being added together for
cumulative effectiveness.

### Behavior
Cells will eventually be given seek and avoid behaviors for predator/prey,
seeking out food/decay in the environment, and finding empty space to undergo
reproduction.  For now movement is random.

### Genes
#### Energy Production
  * *Green* - Photosynthesis
  * *Red* - Predator Behavior / Attacking other cells
  * *Black (currently purple)* - Scavenger / Eats dead and decaying cells and matter
  * *Gray* - Infectious / Infects cells it contacts to replicate virally

#### Abilities
  * *Cyan* - Gives cells the ability to move in their environment
  * *White* - Kills on contact
  * *Blue* - Defensive barrier, cannot be harmed or infected

#### Attribute Boost
  * *Yellow* - Increases fertility.

## Visualization
Each cell's first *gene*, a.k.a. *base gene*, determines the overall color of
the cell.  Each unique gene a cell has is represented as a smaller colored
bubble inside the walls of the cell.  Size is representative of average
*length* for that gene type.

## Environment
**Under Construction**


## To Do
* Switch from p5 to pure HTML5 Canvas
* Implement most gene expressions
* Build editors
* Contemplate the meaning of life
* Steering behaviors
* Frontend
* Backend
*See project details, there's plenty missing there too*



## Technologies
* React
* JavaScript
* Webpack
* Babel
* NodeJS
* SASS
* (future) GraphQL
* (future) Apollo
* (future) MongoDB

## Libraries / npm packages
* Matter.js
* poly-decomp
* p5 (development only)
* CCapture (development only)

## Custom Libraries / Classes
* PRNG
* Org/Cell
* Org Environments
* Gene Expressions
* Matter.js wrapper
