var canvas = document.getElementById('treeCanvas');
var context = canvas.getContext('2d');
context.translate(0.5, 0.5);
var circles = [];
var sorX;
var sorY;
var nodeDrawn = 0;

class Grid extends React.Component {
    
};

class SOR extends React.Component {
    
};

class Platform extends React.Component {
    
};

class Jobs extends React.Component {
    
};

class JobsTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        		sor: [],
            jobs: [],
            topJobs: [],
            drawnJobs: [],
            nodes: [],
            scale: 0,
            nodeRadius: 10,
            longestNodeBranch: 0,
            innerLineWidth: 3,
            outerLineWidth: 6
        };
    }
    
    _loadJobs() {
        $.ajax({
            url: 'http://localhost:8080/jobs/all',
            dataType: 'json',
            success: function(data) {
                this.setState({jobs: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('#Get Error', status, err.toString());
            }.bind(this),
            async: false
        });
    }
    
    _loadLocalJobs() {
        var resourcesPath= document.getElementById("resourcesPath").getAttribute("href");
        $.ajax({
            url: resourcesPath+'/resources/js/JobList.json',
            dataType: 'json',
            success: function(data) {
                this.setState({jobs: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('#Get Error', status, err.toString());
            }.bind(this),
            async: false
        });
    }
    
    //the main render function that handles the generation and organization
    //of the job nodes
    _renderNodes() {
        this.state.scale = 1000 / this.state.jobs.length;
        this.state.nodeRadius = this.state.scale / 10;
        
        this._drawGrid();
        this._getTopNodes();
        if (this.state.topJobs.length > 0) {
            this._drawChildNodes(this.state.topJobs, canvas.width / 2, 0, 
                    canvas.width);
        }
        else
            this._drawChildNodes(this.state.jobs, canvas.width / 2, 0, 
                    canvas.width);
        this._drawLines();
        
        circles = this.state.nodes;
    }
    
    _drawGrid() {
        context.fillStyle="#000";
        context.canvas.width = window.innerWidth*.94;
        context.canvas.height = window.innerHeight * this.state.scale / 100;
        //context.canvas.height = this.state.jobs.length * 100;
        context.beginPath();
        var scale = this.state.scale;
        var height = window.innerHeight*scale;
        var width = window.innerWidth*scale;
        var counter=0;
        for (var x = .5; x < width; x+=scale) {
            context.moveTo(x,0);
            if (counter<10)
                context.fillText(counter++,x-9,10);
            else if (counter<100)
                context.fillText(counter++,x-13,10);
            else if (counter<1000)
                context.fillText(counter++,x-16,10);
            context.moveTo(x,0);
            context.lineTo(x,height);
        }
        context.moveTo(width-.5,0);
        context.lineTo(width-.5, 50);
        counter =0;
        for (var y=.5; y < height; y+=scale) {
            context.moveTo(0,y);
            context.fillText(counter++,0,y-8);
            context.moveTo(0,y);
            context.lineTo(height,y);
        }
        context.moveTo(0, height-.5);
        context.lineTo(width, height-.5);
        context.strokeStyle = "#eee";
        context.lineWidth = 1;
        context.stroke();
        context.fill();
        
        sorX = context.canvas.width/2;
        sorY = 50; 
      
        var fill = '#ddd';
        var xRounded = Math.round(sorX);
        var yRounded = Math.round(sorY);
        
        //draw the node
        context.beginPath();
        context.strokeStyle = "#000";
        context.lineWidth=3;
        context.arc(xRounded, yRounded, 10, 0, 2 * Math.PI);
        context.stroke();
        context.fillStyle = fill;
        context.fill();
        
        context.fillStyle = "#000";
        context.font = "30px Arial";
        context.textAlign="center"; 
        context.fillText("Title", sorX, sorY);
        
        context.closePath();
    }
    
    //gets the jobs that are not children of any other jobs
    _getTopNodes() {
        var self = this;
        this.state.jobs.map(function(job) {
            var isChild = false;
            self.state.jobs.map(function(refJob) {
                refJob.dependencies.map(function(dep) {
                    //if (job.ref === JSON.parse(dep).ref) //Used for API JSON Raw
                    if (job.ref === dep.ref) //Used for JSON Object file
                        isChild=true;
                });
            });
            if (!isChild)
                self.state.topJobs.push(job);
        });
    }
    
    //draws the nodes that are children according to their parents position
    _drawChildNodes(childJobs, parentX, parentY, parentWidth) {
        let self = this;
        var nodeIndex = 0;
        var nodeCount = childJobs.length;
        var yPos = parentY + 1;
        
        //Draw the dependencies of the parent node first
        childJobs.map(function(job) {
            var xPos = Math.round((nodeIndex / nodeCount) * parentWidth 
                    + (parentX - ( parentWidth / 2))
                    + (( parentWidth / nodeCount) / 2));
            self._drawNode(job, xPos, yPos);
            nodeIndex += 1;
        });
        
        //Then draw the dependencies of the dependencies
        nodeIndex = 0;
        childJobs.map(function(job) {
            if (job.dependencies.length > 0) {
                var childJobs = self._getDependencies(job.dependencies);
                //sort the childJobs by reference name
                childJobs.sort(function(jobA, jobB){
                    if (jobA.ref.toLowerCase() < jobB.ref.toLowerCase())
                        return -1;
                    else if (jobA.ref.toLowerCase() > jobB.ref.toLowerCase())
                        return 1;
                    return 0;
                });
                var xPos = Math.round((nodeIndex / nodeCount) * parentWidth 
                    + (parentX - ( parentWidth / 2))
                    + (( parentWidth / nodeCount) / 2));
                self._drawChildNodes(childJobs, xPos, yPos, 
                        parentWidth/nodeCount);
            }
            nodeIndex += 1;
        });
    }
    
    //draws the node at the specified position, with the correct color
    _drawNode(job, xPos, yPos) {
        //job unrun -> grey
        var fill = '#fff';
        //job success -> green
        if (job.state === 1)
            fill = '#70f441';
        //job failure -> red
        else if (job.state === 0)
            fill = '#f4dc42';
        //job warning -> amber
        else if (job.state === 2)
            fill = '#f45f41';
        
        var xRounded = Math.round(xPos);
        var yRounded = Math.round(yPos*this.state.scale);
        
        //draw the node
        context.beginPath();
        context.strokeStyle = "#000";
        context.lineWidth=this.state.innerLineWidth;
        context.arc(xRounded, yRounded, this.state.nodeRadius, 0, 2 * Math.PI);
        context.fillStyle = fill;
        context.fill();
        
        context.fillStyle = "#000";
        var jobLabel = job.category + "/" + job.ref;
        if (jobLabel.length > 15) {
            jobLabel = jobLabel.substring(0,15) + "...";
        }
        context.textAlign="left"; 
        context.font = this.state.scale/8 + "px Arial";
        context.fillText(jobLabel, xRounded + (this.state.scale / 6),
            yRounded + (this.state.scale / 6));
        context.stroke();
        
        //push the drawn node to the nodes array
        this.state.nodes.push({
            id: xRounded + "-" + yRounded,
            jobId: job.id,
            category: job.category,
            type: job.type,
            ref: job.ref,
            state: job.state,
            scheduled: job.scheduled,
            dependencies: job.dependencies,
            x: xRounded,
            y: yRounded,
            radius: this.state.nodeRadius
        });
    }
    
    //checks the whole list of jobs to get the information on the dependecy
    //jobs, then returns them as an object array, and also checks if the job
    //ahs been already drawn, and will not include it if so
    _getDependencies(depRefs) {
        var childJobs = [];
        var self = this;
        this.state.jobs.map(function(job){
            var isDrawn = false;
            self.state.nodes.map(function(node){
                if (node.ref === job.ref)
                    isDrawn=true;
            });
            if (!isDrawn) {
                depRefs.map(function(depRef) {
                    //if (job.ref === JSON.parse(depRef).ref)
                		if (job.ref === depRef.ref)
                        childJobs.push(job);
                });
            }
        });
        return (childJobs);
    }
    
    //for each child dependency, draw a line to that node
    _drawLines() {
        var self = this;
        this.state.nodes.map(function(nodeStart) {
            nodeStart.dependencies.map(function(depRef) {
                for (var i = 0; i < self.state.nodes.length; i++) {
                    //alert(depRef+" == "+self.state.nodes[i].ref);
                		//if (JSON.parse(depRef).ref === self.state.nodes[i].ref) {
                    if (depRef.ref === self.state.nodes[i].ref) {
                        self.state.topJobs.map(function(topJobTest) {
                            if (topJobTest.ref === nodeStart.ref)
                                self._drawLine(sorX, sorY, nodeStart.x, nodeStart.y);
                        });
                        self._drawLine(nodeStart.x, nodeStart.y, 
                                self.state.nodes[i].x, self.state.nodes[i].y);
                        break;
                    }
                }
            });
        });
    }
    
    //Handle drawing a line from one node to another, showing dependency
    _drawLine(startX, startY, endX, endY){
        var headlen = 15;   // length of head in pixels
        var angle = Math.atan2(endY-startY,endX-startX);
        context.beginPath();
        context.strokeStyle = "#000";
        context.lineWidth=this.state.innerLineWidth;
        //Calculate the starting point on the edge of the starting node and 
        //the ending point on the ending node
        var edgeStartX = startX + this.state.nodeRadius * Math.cos(angle);
        var edgeStartY = startY + this.state.nodeRadius * Math.sin(angle);
        var edgeEndX = endX - this.state.nodeRadius * Math.cos(angle);
        var edgeEndY = endY - this.state.nodeRadius * Math.sin(angle);
        
        //Draw line from start to end
        context.moveTo(edgeStartX, edgeStartY);
        context.lineTo(edgeEndX, edgeEndY);
        context.strokeStyle = "#000";
        context.stroke();
        
        //Draw a circle
        context.beginPath();
        context.lineWidth=this.state.innerLineWidth/2;
    	context.arc(edgeEndX, edgeEndY, this.state.nodeRadius/1.75, 
                0, 2 * Math.PI);
    	context.fillStyle = "#eee";
    	context.fill();
        
        //Previously used to show dependency, now using circle dependency ^
        //Draw an arrow
//        context.lineTo(edgeEndX-headlen*Math.cos(angle-Math.PI/6), 
//                edgeEndY-headlen*Math.sin(angle-Math.PI/6));
//        context.moveTo(edgeEndX, edgeEndY);
//        context.lineTo(edgeEndX-headlen*Math.cos(angle+Math.PI/6), 
//                edgeEndY-headlen*Math.sin(angle+Math.PI/6));
                
    	context.strokeStyle = "#000";
        context.stroke();
    }
    
    //Must load the jobs before render to gather data synchronously
    componentWillMount() {
        //this._loadLocalJobs();
        this._loadJobs();
    }
    componentDidMount() {

    }
    render() {
        return (
            <div>
                <div>
                    <table className="table table-condensed legend">
                        <tbody>
                            <tr>
                                <td className="legend-td" style={{backgroundColor: '#70f441'}}></td>
                                <td className="legend-td">Job Completed</td>
                            </tr>
                            <tr>
                                <td className="legend-td" style={{backgroundColor: '#f4dc42'}}></td>
                                <td className="legend-td">Job In Progress</td>
                            </tr>
                            <tr>
                                <td className="legend-td" style={{backgroundColor: '#f45f41'}}></td>
                                <td className="legend-td">Job Failed</td>
                            </tr>
                            <tr>
                                <td className="legend-td" style={{backgroundColor: '#eee'}}></td>
                                <td className="legend-td">Job Did Not Run</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {this._renderNodes()}
                {this.state.nodes.map(function(node) {
                    var nodeId = node.id;
                    return (
                        <div id={nodeId+"-content"} 
                                className="dropdown-content" 
                                key={nodeId+"-content"}>
                            <div>Platform: {node.category}</div>
                            <div>Job Name: {node.ref}</div>
                            <div>State: {node.state}</div>
                            <div>Dependencies:</div>
                            {node.dependencies.map(function(ref) {
                            	return (
                            		//<div>{JSON.parse(ref).ref}</div>
                                <div>{ref.ref}</div>
                                );
                            })}
                        </div>
                    );
                })}
                {}
            </div>
        );
    }
}
//Create a new Map object from the React class Component, and add it to the DOM
ReactDOM.render(
    <JobsTree />,
    document.getElementById('reactJobsTree')
);

//Handle the user hovering over a particular node
//Display a dropdown content box with the relevant information
//that follows the users mouse
canvas.onmousemove = function (e) {
    for (var i=0; i<circles.length; i++) {
        $('#'+circles[i].id+'-content').css('display', 'none');
    }
    var rect = canvas.getBoundingClientRect(),
    x = e.clientX - rect.left,
    y = e.clientY - rect.top,
    i = 0, circle;
    while(circle = circles[i++]) {
        context.beginPath();
        context.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
        if (context.isPointInPath(x, y)) {
            $('#'+circle.id+'-content').css('left', x+"px");
            $('#'+circle.id+'-content').css('top', y+"px");
            $('#'+circle.id+'-content').css('display', 'block');
            break;
        }
    }
};



//call the addResizeCanvasListner to handle when the user changes the size of
//the window
addResizeCanvasListener();
function addResizeCanvasListener() {
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
};
function resizeCanvas() {
    //adjust the size of the canvas based on 90% of the window width
    canvas.width = window.innerWidth*.9;
    
    //clear the contents and rerender the Map
    document.getElementById('reactJobsTree').innerHTML = "";
    ReactDOM.render(
    <JobsTree />,
    document.getElementById('reactJobsTree')
);
}

