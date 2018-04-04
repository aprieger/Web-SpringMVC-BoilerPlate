var canvas = document.getElementById('treeCanvas');
var context = canvas.getContext('2d');
var circles = [];

class JobsTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sors: [],
            jobs: [],
            topJobs: [],
            nodes: [],
            sorBackground: '#1f424f',
            scale: 0,
            sorY: 0,
            sorIndex: 0,
            platformX: 0,
            platformY: 0,
            platformIndex: 0,
            topMargin: 0,
            nodeRadius: 10,
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
            url: resourcesPath+'/js/JobStatusList.json',
            dataType: 'json',
            success: function(data) {
                this.setState({sors: data});
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
        var platformList=this.state.sors[this.state.sorIndex].platforms;
        var self = this;
        platformList.map(function(platform){
            platform.jobs.map(function(job){
                var newestStatus = job.jobStatus.length-1;
                self.state.jobs.push({
                    jobName: job.jobName,
                    platformName: platform.platformName,
                    jobNumber: job.jobStatus[newestStatus].jobNumber,
                    runDate: job.jobStatus[newestStatus].runDate,
                    runTime: job.jobStatus[newestStatus].runTime,
                    schedule: job.jobStatus[newestStatus].schedule,
                    status: job.jobStatus[newestStatus].status,
                    predecessors: job.predecessors
                });
                /*alert(platform.platformName
                		 + ", " + job.jobName
                		 + ", " + job.jobStatus[newestStatus].jobNumber
                		 + ", " + job.jobStatus[newestStatus].runDate
                		 + ", " + job.jobStatus[newestStatus].runTime
                		 + ", " + job.jobStatus[newestStatus].schedule
                		 + ", " + job.jobStatus[newestStatus].status
                		 + ", " + job.predecessors);*/
            });
        });
        
        if (this.state.jobs.length < 5)
            this.state.scale = 200;
        else {
            this.state.scale = 1000 / this.state.jobs.length;
            this.state.nodeRadius = this.state.scale / 10;
        }
        
        this._initCanvas();
        this._drawSor();
        this._getTopNodes();
        if (this.state.topJobs.length > 0) {
            this._drawChildNodes(this.state.topJobs, canvas.width / 2, 0, canvas.width);
        }
        else
            this._drawChildNodes(this.state.jobs, canvas.width / 2, 0, canvas.width);
        this._drawLines();
        
        circles = this.state.nodes;
    }
    
    _initCanvas() {
        context.fillStyle="#000";
        context.canvas.width = window.innerWidth*.94;
        var newCanvasHeight = window.innerHeight * this.state.jobs.length / 12;
        if (newCanvasHeight > window.innerHeight)
            context.canvas.height = newCanvasHeight;
        else
            context.canvas.height = window.innerHeight * .8;
        context.translate(0.5, 0.5);
    } 
    _drawSor() {
        this.state.sorX = context.canvas.width/2;
        this.state.sorY = this.state.topMargin + 50; 
        this.state.topMargin = this.state.sorY;

        var fill = '#fff';
        var xRounded = Math.round(this.state.sorX);
        var yRounded = Math.round(this.state.sorY);

        context.beginPath();
        //draw the node
        context.strokeStyle = "#000";
        context.lineWidth=3;
        context.arc(xRounded, yRounded, 10, 0, 2 * Math.PI);
        context.stroke();
        context.fillStyle = fill;
        context.fill();
        //draw the label
        context.fillStyle = "#000";
        context.font = "30px Arial";
        context.textAlign="center"; 
        context.fillText(this.state.sors[this.state.sorIndex].sorName, xRounded, yRounded-20);
        context.closePath();		
    }
 
    //gets the jobs that are not children of any other jobs
    _getTopNodes() {
        var self = this;
        this.state.jobs.map(function(job) {
            var isChild = false;
            self.state.jobs.map(function(refJob) {
                refJob.predecessors.map(function(pred) {
                    //if (job.jobName === JSON.parse(pred).jobName) //Used for API JSON Raw
                    if (job.jobName === pred.jobName) //Used for JSON Object file
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
        
        //Draw the predecessors of the parent node first
        childJobs.map(function(job) {
            var xPos = Math.round((nodeIndex / nodeCount) * parentWidth + (parentX - ( parentWidth / 2)) + (( parentWidth / nodeCount) / 2));
            self._drawNode(job, xPos, yPos);
            nodeIndex += 1;
        });
        
        //Then draw the predecessors of the predecessors
        nodeIndex = 0;
        childJobs.map(function(job) {
            if (job.predecessors.length > 0) {
                var childJobs = self._getPredecessors(job.predecessors);
                //sort the childJobs by reference name
                childJobs.sort(function(jobA, jobB){
                    if (jobA.jobName.toLowerCase() < jobB.jobName.toLowerCase())
                        return -1;
                    else if (jobA.jobName.toLowerCase() > jobB.jobName.toLowerCase())
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
        var fill = '#fff';
        
        //job success -> green
        if (job.status == "Completed")
            fill = '#70f441';
        //job failure -> red
        else if (job.status === "Failed")
            fill = '#f4dc42';
        //job warning -> amber
        else if (job.status === "In-Progress")
            fill = '#f45f41';
        //job unrun -> grey
        else if (job.status === "Not Run")
            fill = '#ccc';
        
        var xRounded = Math.round(xPos);
        var yRounded = Math.round(yPos * this.state.scale) + this.state.topMargin;
       
        //draw the node
        context.beginPath();
        context.strokeStyle = "#000";
        context.lineWidth=this.state.innerLineWidth;
        context.arc(xRounded, yRounded, this.state.nodeRadius, 0, 2 * Math.PI);
        context.fillStyle = fill;
        context.fill();
        
        context.fillStyle = "#000";
        var jobLabel = job.platformName + " / " + job.jobName;
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
            jobName: job.jobName,
            platformName: job.platformName,
            jobNumber: job.jobNumber,
            runDate: job.runDate,
            runTime: job.runTime,
            schedule: job.schedule,
            status: job.status,
            predecessors: job.predecessors,
            x: xRounded,
            y: yRounded,
            radius: this.state.nodeRadius
        });
    }
    
    //checks the whole list of jobs to get the information on the dependecy
    //jobs, then returns them as an object array, and also checks if the job
    //ahs been already drawn, and will not include it if so
    _getPredecessors(predJobs) {
        var childJobs = [];
        var self = this;
        this.state.jobs.map(function(job){
            var isDrawn = false;
            self.state.nodes.map(function(node){
                if (node.jobName === job.jobName)
                    isDrawn=true;
            });
            if (!isDrawn) {
            		predJobs.map(function(predJob) {
                    //if (job.jobName === JSON.parse(predJob).jobName)
                		if (job.jobName === predJob.jobName)
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
            nodeStart.predecessors.map(function(predJob) {
                for (var i = 0; i < self.state.nodes.length; i++) {
                    //alert(predJob+" == "+self.state.nodes[i].jobName);
                    //if (JSON.parse(predJob).jobName === self.state.nodes[i].jobName) {
                    if (predJob.jobName === self.state.nodes[i].jobName) {
                        self.state.topJobs.map(function(topJobTest) {
                            if (topJobTest.jobName === nodeStart.jobName)
                                self._drawLine(self.state.sorX, self.state.sorY, nodeStart.x, nodeStart.y);
                        });
                        self._drawLine(nodeStart.x, nodeStart.y, self.state.nodes[i].x, self.state.nodes[i].y);
                        break;
                    }
                }
            });
        });
    }
    
    //Handle drawing a line from one node to another, showing dependency
    _drawLine(startX, startY, endX, endY){
        context.globalCompositeOperation = "destination-over";
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
//        context.beginPath();
//        context.lineWidth=this.state.innerLineWidth/2;
//    	context.arc(edgeEndX, edgeEndY, this.state.nodeRadius/1.75, 
//                0, 2 * Math.PI);
//    	context.fillStyle = "#eee";
//    	context.fill();
        
        //Previously used to show dependency, now using circle dependency ^
        //Draw an arrow
        context.lineTo(edgeEndX-headlen*Math.cos(angle-Math.PI/6), 
                edgeEndY-headlen*Math.sin(angle-Math.PI/6));
        context.moveTo(edgeEndX, edgeEndY);
        context.lineTo(edgeEndX-headlen*Math.cos(angle+Math.PI/6), 
                edgeEndY-headlen*Math.sin(angle+Math.PI/6));
        context.strokeStyle = "#000";
        context.stroke();
        context.globalCompositeOperation = "source-over";
    }
    
    //Must load the jobs before render to gather data synchronously
    componentWillMount() {
        this._loadLocalJobs();
        //this._loadJobs();
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
                        <div id={nodeId+"-content"} className="dropdown-content" key={nodeId+"-content"}>
                            <div>Job Name: {node.jobName}</div>
                            <div>Job Number: {node.jobNumber}</div>
                            <div>Platform: {node.platformName}</div>
                            <div>Run Date: {node.runDate}</div>
                            <div>Run Time: {node.runTime}</div>
                            <div>Schedule: {node.schedule}</div>
                            <div>Status: {node.status}</div>
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
    document.getElementById('reactJobsTree'));
}

