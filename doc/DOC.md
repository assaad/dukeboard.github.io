Getting started
---------------

### Kevoree and Models
Kevoree makes an intensive use of Models. Physically, models are structured files in JSON or XMI format, used to carry the description of a component, an entire library, the location where the binary files can be found and/or the description of a software system to deploy with all the component instances and their connections. 

### The Kevoree Editor

The Kevoree Editor provides a model authoring tool specialized for Kevoree Models.
It offers a Graphical Editor in which modifications on models are made principally using drag&drop mechanisms.
It also embeds a Kevoree Scripting engine developed to simplify the modifications.

> [Kevoree Editor >](http://oss.sonatype.org/service/local/artifact/maven/redirect?r=public&g=org.kevoree.tools&a=org.kevoree.tools.ui.editor&v=RELEASE)

### Kevoree Runtimes
Kevoree offers several runtime environments. Among others, the Java runtime of Kevoree wraps a Java Virtual Machine with all the necessary features to handle the deployment of models received from editors or local components.

* Use Kevoree for test purpose, go for Runtime GUI version : 

> [ Java Runtime w. GUI >](http://oss.sonatype.org/service/local/artifact/maven/redirect?r=public&g=org.kevoree.platform&a=org.kevoree.platform.standalone.gui.prompt&v=RELEASE)

* Use Kevoree for command line usage, go for standalone JAR version : 

> [ Java Standalone >](http://oss.sonatype.org/service/local/artifact/maven/redirect?r=public&g=org.kevoree.platform&a=org.kevoree.platform.standalone.gui.prompt&v=RELEASE)

* Use Kevoree as a Service for production deployment, go for the DEB version (for Ubuntu like server, or Raspian OS) with watchdog :

> [Java Watchdog >](http://oss.sonatype.org/service/local/artifact/maven/redirect?r=public&g=org.kevoree.watchdog&a=org.kevoree.watchdog&v=RELEASE)

 
Making a component
---------------

### Process

1. Create the business code of the component. Make sure it works by simply adding a main, that creates, starts and stops your component.
2. Decorate your code with the Kevoree Annotations to specify that your class is a Kevoree Component, which are the Input ports, Required services, the Output ports, the Provided services, the parameters of your component and the services your require from the runtime.
3. Compile your code using the Kevoree Annotaion plugin, then the code compiler dependent of your implementation language.
4. Enjoy !


### The Annotation API

The Annotation API is made to provide a simple and flexible way to decorate your existing code to declare it as a `component`, `channel`, `node` or `group`.

#### Types
**Components**   
New kind of Component are declared by placing a `@ComponentType` annotation on their implementation class.    
**Channels**   
The channels are in charge of the transpot of messages and objects, from output to input ports. Each channel type has a different behavior (sync, async, parallel, sequential, first-answer, etc.) and is declared by putting a `@ChannelType` on its implementation class.   
**Groups**   
The groups are responsible for the dispatch and synchronization of the models between several nodes. Just as the channels, they can have different dispatch and synchronization policies for each type. They are declared by putting a `@GroupType` annotation on their implementation class.   
**Nodes**   
The nodes support the deployment of components or sub-nodes, so that the runtime always conforms to the last consistent model a node received. They are declared by putting a `@NodeType` annotation on their implementation class.

>Java
*************

```
@ComponentType
public class HelloProducerComponent{...}

@ChannelType
public class AsyncBroadcast implements ChannelDispatch {...}

@GroupType
public class WebSocketGroup {...}

@NodeType
@Library(name = "Java")
public class JavaNode implements ModelListener, org.kevoree.api.NodeType {...}
```
>Kotlin
*************

```
public ComponentType class HelloProducerComponent{...}

public ChannelType class AsyncBroadcast implements ChannelDispatch {...}

public GroupType class WebSocketGroup {...}

public NodeType class JavaNode implements ModelListener, org.kevoree.api.NodeType {...}
```


#### Input Ports - Provided Methods

If you are used to Message-Oriented approaches, you just have to put a `@Input` annotation on the method you want to expose as an input port. If you are more familiar with Service-Oriented approaches, you will have to put a `@Provided` annotation on  each method you want to expose/offer.    
The port gets its name from the method name. The mapped methods have to declare a unique `Object`-typed parameter. In case this parameter is missing, the method will be called and any parameter from the caller will be dropped. In case the method has more than one parameter, an error will be triggered.    
In Kevoree, we have mixed the Message and Service oriented approaches. To this end, each call on a port can declare an optional `Callback` method. Any value returned from an `Input` or a `Provided` method will be forwarded to the caller and passed as parameter to the callback method it declared.

>Java
*************

```Java
@Input
public void sayHelloTo(Object msg) {...}

@Provides
public Boolean getTemp() {...}
```

>Kotlin
*************

``` Kotlin
public Input void sayHelloTo(Object msg) {...}

public Provides Boolean getTemp() {...}	```

#### Output Ports - Required Methods

If you are used to Message-Oriented approaches, you just have to put a `@Output` annotation on a field of the class that will host the port. This field has to be typed as `Port` from the Kevoree API. If you are more familiar with Service-Oriented approaches, you will have to put a `@Required` annotation on  each method you want to use.    
The port gets its name from the field name.    
In Kevoree, we have mixed the Message and Service oriented approaches. To this end, each call on a port can declare an optional `Callback` method. This method is called as soon as the execution of the call is completed. The parameter of the callback is the value of the return of the `Input / Provided` port connected.

>Java
*************

> **Without callback**   
 
```Java
@Output
private org.kevoree.api.Port helloProduced;

public void onHelloProduced(String greetingMessage) {
	helloProduced.send(greetingMessage);
}
```
> **With callback**    

```Java
@Required
private org.kevoree.api.Port userDecision;

public boolean askUser(String questionMessage) {
	userDecision.call(greetingMessage, new Callback() {
		public void run(Object result) {
        	return (Boolean)result;
        }
    });
}
```

#### Parameters

Parameters are sometimes useful to adapt the behavior of a piece of code. These parameters can be used to set the delay of a timeout, a display name of a frame, the color of a frame, etc.     
To declare a parameter, just declare a field in your class, and add to it the `@Param` annotation. The default value of a parameter has to be specified in the annotation as shown on the right.    
<span class="warning-bloc"><span class="fa fa-exclamation-triangle fa-lg orange"></span> Kevoree only supports the `Param` annottaion on *Primitive* types and their boxing equivalent.</span>  



>Java
*************

```Java
@Param
String name;

@Param (defaultValue = "2000")
int delay;
```

>Kotlin
*************

``` Kotlin
Param(defaultValue = "default") var name : String = "default" ;
```

#### Library  

The Library annotation makes it possible for you to organize the components you create into virtual Libraries. It has nothing to do with the deployment, the location of the binaries or the behavior of your component. It can be whatever you want.
<span class="warning-bloc"><span class="fa fa-exclamation-triangle fa-lg orange"></span> The Library annotation must always be placed after the type declaration annotation (i.e.: ComponentType, ChannelType, etc.).</span>  

>Java
*************

``` Java
@NodeType
@Library(name = "Java")
public class JavaNode implements ModelListener, org.kevoree.api.NodeType {...}
```
>Kotlin
*************

```kotlin
public ComponentType Library(name="Java") class HelloKotlin {...}
```



#### Kevoree services injection
Several services from the Kevoree runtime can be injected into a component, channel, group or node, on demand. To do so, just place a `KevoreeInject` annottaion on a variable typed by the servcie you need. The services available are:    
**ModelService**   
**BootstrapService**      
**KevScriptService**     
**Context**   
**ChannelContext**

>Java
*************

``` Java
@KevoreeInject
ChannelContext channelContext;
```

>Kotlin
*************

```kotlin
KevoreeInject ChannelContext channelContext;
```
    

#### Life Cycle
In Kevoree, Components, Channels, Groups and Nodes have a Life Cycle.   
Thus, the runtime must be able to  start, stop and update these elements when needed.    
Depending on these elements' implementation, it may sometimes be required to perform some actions when stoping, starting or updating them.
Life Cycle annotations are here to allow you to specify the methods to call on start, stop or update.
There is no constraint on the method you select for these operation.
<span class="warning-bloc"><span class="fa fa-exclamation-triangle fa-lg orange"></span> Be cautious about what you do in these methods, because you can freeze the entire runtime if you create a deadlock !</span>    
>Java
*************

``` Java
@Start
public void startComponent() {...}
    
@Stop
public void stopComponent() {...}
    
@Update
public void updateComponent() {...}
```
>Kotlin
*************

```kotlin
Start fun startComponent(){...}

Stop fun stopComponent(){...}

Update fun updateComponent(){...}
```

### The Kevoree Maven Plugin

The Kevoree Maven plugin is used to extract the Component-Model from the annotations placed in your code, and store it into a Kevoree Model packed along with the compiled class files.     
Also, for the ease of use, the Kevoree Maven plugin embeds a Kevoree runner. This runner launches a Kevoree runtime using a KevScript file. This file is supposed to be `src/main/resources/kevs/main.kevs` in the project. If otherwise, you can specify the location of the KevScript file you want to use in the configuration of the plugin.    
You can also specify the name of the node you want to launch.

```
<plugin>
	<groupId>org.kevoree.tools</groupId>
	<artifactId>org.kevoree.tools.mavenplugin</artifactId>
	<version>${kevoree.version}</version>
	<executions>
		<execution>
			<goals>
				<goal>generate</goal>
			</goals>
		</execution>
	</executions>
	<configuration>
		<nodename>MyNode</nodename>
		<model>src/main/kevs/main.kevs</model>
	</configuration>
</plugin>
```
### Kevoree Runtime options

Both Kevoree runtime platform are runnable as classical Java application. In other word `java -jar KevoreeRuntime.jar` . In addition two option system option are available:

	* node.name : allows to associate a node name with the runtime
	* node.bootstrap : allows to give an initial bootstrap model (.json,.kev.kevs accepted)
	* o or offline : allows to put Kevoree in offline mode
	
Reminder, bootstrap option must be before the -jar option.


Kevoree Script (aka KevScript)
---------------
KevScript is a scripting language developed to simplify the authoring of models at design and run-time.
<span class="warning-bloc"><span class="fa fa-exclamation-triangle fa-lg orange"></span>  KevScript is a scripting language to manipulate a model. The KevoreeScriptEngine takes a script and a source model as input, and returns a new model modified according to the script.</span>

### How to script ?

1. First, write your adaptation script. Describe the modifications you want to operate on the model.
1. Then ask for the execution of this script on a model.

<span class="warning-bloc"><span class="fa fa-exclamation-triangle fa-lg orange"></span>  KevScript is sequential! It means that, for instance, you have to create an instance BEFORE using it in a bind command.</span>


### Dynamic adaptation of a Kevoree Runtime
The dynamic adaptation of a Kevoree Runtime is not the business of KevScript.
If you want to use a KevScript to realize an adaptation of your system, you have to:   

1. Create a KevScript and ask for its execution on a model. This execution will give you a new model.
1. Ask the runtime for a deployment of this new model.
2. 

### KevScript Commands

**Comments**    
If you want to comment a line in your KevScript, here you go.
```
// this is a comment
// comments allow any characters ! \ù%*é=^``~&°.:!§,?/#çà][-|
```

**Namespace**   
A namespace allows to group several elements under a unique name, in order to simplify the manipulation on these elements. For instance, you can declare a namespace to which you add several nodes, to be able to write their connection to the same synchronization group as presented on the right.   
Elements are added in namespaces using the `attach` command, they can be removed from the namespace using `detach`. A namespace can be completely removed using the `remove` command. 

```
namespace space42
attach node0, node1 space42
attach space42 sync
detach node1 space42
remove space42
```


**Repository**     
Adds a repository location for the resolution of binaries.
```
repo org.sonatype.org/foo/bar?a=b&c=d
repo http://oss.sonatype.org/content/repositories/releases
```

**Include**     
Imports a library of types in the model, makes the Types available.   
A fixed version number enforce the use of a specific version of library that will never change.    
A `SNAPSHOT` version will always get the last version of the library, in snapshot mode.   
A `RELEASE` version tag indicates that the version has to be updated to the latests release of the library.    
A `LATEST` version tag (the default) looks for the latest version of the library, regarless of its type (release or snapshot) based on the build timestamp.
```
include mvn:org.kevoree.library.java:org.kevoree.library.java.javaNode:3.0.0
include mvn:org.kevoree.library.java:org.kevoree.library.java.javaNode:3.0.0-SNAPSHOT
include mvn:org.kevoree.library.java:org.kevoree.library.java.javaNode:RELEASE
include mvn:org.kevoree.library.java:org.kevoree.library.java.javaNode:LATEST
```

**Add**       
Adds a new instance of `Component`, `Node`, `Channel` or `Group`.    
You can add several elements of the same type, at the same time, by separating the instances' names with a `,`.    
When the element you add is a component instance, you `MUST` specify the node that will host this instance, using a dotted notation (i.e.: node0.instance0 : MyComponentType).
```
add node0, node1 : JavaNode
add sync : WebSocketGroup/0.0.2-SNAPSHOT
add node0.comp0 : ToyConsole
add node0.comp1, node0.comp2 : ToyDisplay
add chan0 : DelayBufferedChannel
```

**Remove**   
Removes elements from the model.
```
remove node0
remove sync
remove chan0
```

**Move**   
Moves one or several instances to another node. Instances can be of type `NodeType` or `ComponentType`. The last parameter of the command is always the destination node.
```
move node0.comp0 node1
move *.* node0 //moves all components of all nodes, to node0
move node0.comp0, node0.comp1 node1
```

**Set**   
Used to set parameters of instances.   
Some parameters are `fragment dependent`. In this case, a property can have a different value on each node howting a fragment (it can be the case for Groups and Channels). In this case, the property is set using a `<element>.<property>/<node> = "<value>"` notation.
```
set node0.comp0.foo = "bar"
set node0.*.baz = 'potato' //sets the property baz of all components on node0
set sync.forcePush = "false"
set sync.port/node0 = '8000'
```
 
**Bind**   
Binds the port, or several ports, of a component instance to several channel instances. 
```
bind node0.base.output chan0
bind node0.base.input chan0
```

**Unbind**   
Disconnects the port of a component from a channel.
```
unbind node0.base.input chan0
```

**Attach**   
The last parameter of this command can be an instance of `group`or a `namespace`.
If the last parameter is a namespace, the list of parameters can be whatever you want. If the last parameter is a group, the elements should be nodes or namespaces.
```
attach node0 sync
attach node1, node2 sync
attach * sync
attach * space42
```

**Detach**   
Disconnects one or several node instances from a synchronization group. The group is always at the last position in the command.
```
detach node0 sync2
```

**Network**   
Specifies the IP address on which a node is reacheable. In addition give as last parameter an interface face, this must be unique.
```
network node0.ip.eth0 192.168.0.1
```



Cloud Management with Kevoree
---------------

Kevoree can be used as a Cloud management layer, simply by following this idea. If a node is a container, it can as well contains other nodes, which can then host components. In others words, simply by composing Nodes with can manage Cloud virtual infrastructures by mapping Kevoree nodes to virtual machines. 

Again, everything is about manipulating model, KevScript is then the simplest way to dynamically manipulate infrastructures. 

**Add nodes**
This allows to create a new virtual machine in another container. Here `infra0` is the container, in other words, one of the IaaS (infrastructure) nodes set. `vm0` is then a PaaS (platform) node, ready himself to host components. 
```
add infra0.vm0 : JavaNode
```

**Remove nodes**
In the same manner, one can delete a now from his container.
```
remove infra0.vm0
```

**Move nodes**
The move instruction is a migration command. It allows to migrate a virtual machine to another containers.
```
move infra0.vm0 infra1
```

### Sandbox properties

section coming soon...

### Available mappings to infrastructure

Each Kevoree node types can refine the creation of child nodes. Each of them, offer several virtualization capabilities.

**JavaNode**
The is the default implementation. Basically it create a second process for each child node which run in a separated virtual machine. This light virtualization layer protect for process interation but offer no protection in term of network or disk.

**LXCNode**
This Node type create each child in a Linux container. This offer a light virtualization but  isolate network and disk from each machine. This prevent network port collisition and allows to define CPU share time between child nodes.

**DockerIO**
Similar to LXC node, but using docker project as a backend.

**KVMNode**
soon...

**EC2Node**
soon...




