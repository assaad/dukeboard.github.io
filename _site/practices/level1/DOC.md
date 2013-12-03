Make your own Components
---------------

### Objectives

### Setting up your environment
First of all, you need to have a `JRE 1.6` at least, [Apache Maven 3](http://maven.apache.org/download.cgi) installed and your favourite Environment of Development for Java. We would suggest using [IntelliJ](http://www.jetbrains.com/idea/download/index.html) or [NetBeans](https://netbeans.org/downloads/index.html).    
Then browse to the [Kevoree Download Section](http://www.kevoree.org/download "Title") and download the last stable version of the Project Sample. Unzip the file in a convenient place (avoid spaces in the path). You may have to update the version of Kevoree used by the sample. To do so, open the pom.xml file located at the root of the sample project folder in a text editor. Replace the value of the `<version>` tag by the current release version number of Kevoree you are using.

> [Sample Project >](http://kevoree.org/sample.zip)


Compile with Maven
---------------



What did we do?
---------------

Now it is time to go a bit deeper in the code.   

### The components

Have a look in the src/main/java folder. Here is the code of the component we just compiled. As you can imagine, these components implements a Pro- ducer/Consumer example. The HelloProducerThread is a utility class that produces HelloWorld messages regularly. The two components (in Kevoree terms) are those called *Component.   

### The POM

Open now the pom.xml file. This file is the configuration file for Maven executions.


Continuous Design
-----------------




Do It Yourself
---------------


I now want you to create two components. You can do it in the same project (tooooo easy) or create a new project from scratch (yeah !... you can still get inspired by the sample project).    
