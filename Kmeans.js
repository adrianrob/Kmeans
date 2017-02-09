
console.log("c est partit pour un Kmeans");

var distEuclidian = function(p1,p2){
  return Math.sqrt(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2));
};
var toRGB = function(cluster){
  if(cluster == 0)
    return 'rgb(255,0,0)';
  if(cluster == 1)
      return 'rgb(0,255,0)';
  if(cluster == 2)
        return 'rgb(0,0,255)';
  return 'rgb(0,0,0)';
};

var canvasH = 400;
var canvasW = 400;

// intialize
var points = [];
var pDim = 2;
var i=0;
var j=0;
var K=3;
var nPoints = 100;
var clusters = [];
var centroids=[];
var stillEvoles =true;

var initialize = function(){
  points = [];
  clusters = [];
  centroids=[];
  for(i;i<K;i++)
  {
    clusters[i] = [];
    centroids[i] = {x:0,y:0,cluster:i};
  }
  i=0;
  for(i;i<nPoints;i++)
  {
    points[i] = {x:Math.trunc(canvasW*Math.random()),y:Math.trunc(canvasH*Math.random()),cluster:-1};
  }
}

// randomly assign points to a certain amount K of clusters
var assignRandCluster = function (){
  var randCluster = 0;
  var stay = false;
  if(K>nPoints)
      console.log("too many clusters!");

  do
  {
    stay = false;
    for(i=0;i<nPoints;i++)
    {
      do {
        randCluster = Math.trunc(K*Math.random());
      } while (randCluster == K);
      clusters[randCluster].push(points[i]);
      points[i].cluster = randCluster;
    }

    for(i=0;i<K;i++)
    {
      if(clusters[i].length == 0)
      {
        stay = true;
        break;
      }
    }
    if(stay)
    {
      for(i=0;i<K;i++)
      {
        clusters[i] = [];
      }
    }
  }while(stay)
}

// get centroids
var getCentroids = function(){
  for(i=0;i<K;i++){
    if(clusters[i].length == 0)
      console.log('cluster '+i+ ' got empty during reassignment!');
    centroids[i].x = 0;
    centroids[i].y = 0;
    for(j=0;j<clusters[i].length;j++)
    {
      centroids[i].x += clusters[i][j].x;
      centroids[i].y += clusters[i][j].y;
    }
    centroids[i].x = centroids[i].x / clusters[i].length;
    centroids[i].y = centroids[i].y / clusters[i].length;
  }
}

// reassign points to best clusters
var reassign = function(){
  for(j=0;j<K;j++){
    clusters[j] = [];
  }
  var closestDist = 1000000;
  var closestInd = 0;
  var currentDist =0;

  for(i=0;i<nPoints;i++) // foreach point
  {
    closestDist = 1000000;
    closestInd = 0;
    for(j=0;j<K;j++) // foreach cluster
    {
      currentDist = distEuclidian(points[i],centroids[j]);
      if(closestDist > currentDist) // get fittest cluster
      {
         closestInd=j;
         closestDist = currentDist;
      }
    }
    if(points[i].cluster != closestInd)  //stay in loop
    {
      stillEvoles = true;
    }
    //move point
    clusters[closestInd].push(points[i]);
    points[i].cluster = closestInd;
  }
}

// K-means : assign, getCentroids, reassign &loop
var kmeans = function(){
  initialize();
  assignRandCluster();
  while(stillEvoles) {
  stillEvoles =false;
  getCentroids();
  reassign();
  }
}

// log results
var print = function(){
  console.log(clusters[0]);
  console.log(clusters[1]);
  console.log(clusters[2]);
  console.log('cluster 1 :' + centroids[0]);
  console.log('cluster 2 :' + centroids[1]);
  console.log('cluster 3 :' + centroids[2]);
}

var start = function(){
var svg = d3.select(".svg1")
            .attr("width", canvasW)
            .attr("height", canvasH);
            svg.append("rect")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill", "Silver");
initialize();
assignRandCluster();
var circlesPoints = svg.selectAll("circle").filter(".point")
              .data(points)
              .enter()
              .append("circle");

              circlesPoints.attr("cy",function(d){return (canvasH-d.y)+"px"})
              .attr("cx",function(d){return d.x +"px"})
              .attr("r",function(){return "5px"})
              .attr("fill",function(d){return toRGB(d.cluster);});
              var circlesCentroids = svg.selectAll("circle").filter(".centroid")
                                  .data(centroids)
                                  .enter()
                                  .append("circle");

                                  circlesCentroids.attr("cy",function(d){return (canvasH-d.y)+"px"})
                                  .attr("cx",function(d){return d.x +"px"})
                                  .attr("r",function(){return "4px"})
                                  .attr("fill",function(d){return toRGB(d.cluster);})
                                  .attr("stroke",function(){return "black";})
                                  .attr("stroke-width",function(){return "3px";});

var svg = d3.select(".svg2")
        .attr("width", canvasW)
        .attr("height", canvasH);
    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "Silver");
}

var move = function(){
  if(stillEvoles) {
  stillEvoles =false;
  getCentroids();
  reassign();
var svg = d3.select(".svg1");
var circlesPoints =  svg.selectAll("circle").filter(".point")
                .data(points);
var circlesCentroids =  svg.selectAll("circle").filter(".centroid")
                .data(centroids)

circlesPoints.enter().append("circle");
circlesCentroids.enter().append("circle");
circlesPoints.attr("cy",function(d){return (canvasH-d.y)+"px"})
.attr("cx",function(d){return d.x +"px"})
.attr("r",function(){return "5px"})
.attr("fill",function(d){return toRGB(d.cluster);});
circlesCentroids.attr("cy",function(d){return (canvasH-d.y)+"px"})
.attr("cx",function(d){return d.x +"px"})
.attr("r",function(){return "4px"})
.attr("fill",function(d){return toRGB(d.cluster);})
.attr("stroke",function(){return "black";})
.attr("stroke-width",function(){return "3px";});
circlesCentroids.exit().remove();
circlesPoints.exit().remove();
  }
};
//move();
/*
setInterval(function() {
  kmeans();
  print();
  update();
}, 1500);*/
