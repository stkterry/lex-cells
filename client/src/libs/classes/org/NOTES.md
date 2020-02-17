### Org Structure

* **mjsi**: instance of the MJSWrapper, contains all functions needed for matter

* **genes**: A complex genes object, 
~~~js
{
  nSeg: "Number of segments in the cell's genes",
  totalGenesLength: "Combined lengths of all genes in segments",
  avgGeneArea: "Combined average radial area of all genes in segment",
  segments: [
    { 
      color: "Color of gene segment 1",
      length: "Length of gene segment 1"
    }, 
    ...
  ]
}
~~~

* **nucleus**: Mostly the matter.js body of the cell, 
~~~js
{
  r: "The radius of the body (multiplied by a cellScale factor...",
  body: "Matter instance representing the nucleus of the cell.
    Also multiplied by a cellScale factor"
}
~~~

* **expression**: The actual representation of the collective genes.
~~~js
{
  expressions: {
    'color1': 'expression class object' --> {length, color, body, constraint, etc...}
    ...
  },
  body
}

~~~