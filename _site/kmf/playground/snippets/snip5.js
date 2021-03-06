var cloud = factory.createCloud();
var myAmazonEC2node = factory.createNode();
myAmazonEC2node.id = "EC2_0";
cloud.addNodes(myAmazonEC2node);
var myNginx = factory.createSoftware();
myNginx.name = "SRV0";
myAmazonEC2node.addSoftwares(myNginx);

draw(cloud,"Original");

var emptyCloud = factory.createCloud();

//Produce the trace sequence of MO -> M1
var diffSeq = compare.diff(emptyCloud,cloud);
console.log(diffSeq.exportToString());

//Produce the trace sequence of MO inter M1
var interSeq = compare.inter(emptyCloud,cloud);
console.log(interSeq.exportToString());

draw(emptyCloud,"Before merge");

//Merge M1 into M0
diffSeq.applyOn(emptyCloud);

draw(emptyCloud,"After merge");
