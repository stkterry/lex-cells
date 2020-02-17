# Lex Cells | A Sim/Game of Genetics and Evolution

**Note: Early pre-release, under major construction**

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


## Cell Behavior
Cells will be driven with the sole purpose of reproduction.  Each gene, of which
there are currently 8, will provide a unique benefit, attribute bonus, or means
of absorbing energy from the environment.  Once a cell has enough energy, it
will divide without intervention.

Cells can have between 2 and 16 *genes*, each of which has a *length* factor.
The length factor will determine the effectiveness of that gene.  Multiple 
duplicate genes are possible, with the total *length* being added together for
cumulative effectiveness.

## Visualization
Each cell's first *gene*, a.k.a. *base gene*, determines the overall color of
the cell.  Each unique gene a cell has is represented as a smaller colored
bubble inside the walls of the cell.  Size is representative of average
*length* for that gene type.

## Environment
**Under Construction**


## Technologies
* JavaScript
* Webpack
* Babel
* NodeJS
* SASS
* (future) GraphQL
* (future) Apollo
* (future) MongoDB

## Libraries
* Matter.js
* poly-decomp
* React
* p5 (development only)
* CCapture (development only)
