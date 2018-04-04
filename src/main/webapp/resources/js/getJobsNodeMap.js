var canvas = document.getElementById('mapCanvas');
var context = canvas.getContext('2d');
var circles = [];

class JobsMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            nodes: [],
            scale: 80,
            nodeLineCount: 0,
            nodeX: 0,
            nodeY: 1,
            nodeDirection: "right",
            nodeRadius: 10,
            nodeLineWidth: 3
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
    _drawGrid() {
        context.fillStyle="#000";
        context.canvas.width = window.innerWidth*.94;
        context.canvas.height = window.innerHeight;
        /*context.beginPath();
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
        context.closePath();*/
    }
    _drawNode(fill, job) {
        if (canvas.width < (this.state.nodeLineCount+2)*this.state.scale) {
            this.state.nodeLineCount=0;
            this.state.nodeY++;
            this._drawLoopBackLine();
            if (this.state.nodeDirection==="right")
                this.state.nodeDirection="left";
            else if (this.state.nodeDirection==="left")
                this.state.nodeDirection="right";
        }
        else {
            if (this.state.nodeDirection==="right")
                this.state.nodeX++;
            else if (this.state.nodeDirection==="left")
                this.state.nodeX--;
            this._drawLine();
        }
        var x = this.state.nodeX*this.state.scale;
        var y = this.state.nodeY*this.state.scale;
        context.beginPath();
        context.strokeStyle = "#000";
        context.lineWidth=this.state.nodeLineWidth;
        context.arc(x, y, this.state.nodeRadius, 0, 2 * Math.PI);
        context.fillStyle = fill;
        context.fill();
        context.stroke();

        context.fillStyle = "#777";
        var jobLabel = job.category + "/" + job.ref;
        if (jobLabel.length > 15) {
            jobLabel = jobLabel.substring(0,15) + "...";
        }
        context.textAlign="center"; 
        context.font = this.state.scale/6 + "px Arial";
        if (this.state.nodes.length%2 > 0)
            context.fillText(jobLabel, x, y + (this.state.nodeRadius*2.5));
        else
            context.fillText(jobLabel, x, y - (this.state.nodeRadius*2.5));
        context.stroke();
	    	
        var self = this;
        var status;
        if (job.state === 0) {
            status = "Job In Progress";
        }
        else if (job.state === 1) {
            status = "Job Completed";
        }
        else if (job.state === 2) {
            status = "Job Failed";
        }
        this.state.nodes.push({
            id: x + "-" + y,
            jobId: job.id,
            category: job.category,
            type: job.type,
            ref: job.ref,
            status: status,
            scheduled: job.scheduled,
            dependencies: job.dependencies,
            x: x,
            y: y,
            radius: self.state.nodeRadius
        });
        this.state.nodeLineCount++;
    }
    _drawLine(){
        var lineX = this.state.nodeX*this.state.scale;
        var lineY = this.state.nodeY*this.state.scale;
        context.beginPath();
        
        if (this.state.nodeDirection==="right") {
            context.moveTo(lineX, lineY);
            context.lineTo(lineX - this.state.scale, lineY);
        }
        else if (this.state.nodeDirection==="left") {
            context.moveTo(lineX, lineY);
            context.lineTo(lineX + this.state.scale, lineY);
        }
	    	context.globalCompositeOperation='destination-over';
	    	context.strokeStyle = "#000";
	    	context.lineWidth=this.state.nodeLineWidth;
	    	context.stroke();
	    	context.globalCompositeOperation='source-over';

    }
    
    _drawLoopBackLine(){
        var lineX = this.state.nodeX*this.state.scale;
        var lineY = (this.state.nodeY-.5)*this.state.scale;
        context.beginPath();
        
        if (this.state.nodeDirection==="right") {
            context.arc(lineX, lineY, this.state.scale/2, 1.5 * Math.PI, .5 * Math.PI);
        }
        else if (this.state.nodeDirection==="left") {
            context.arc(lineX, lineY, this.state.scale/2, .5 * Math.PI, 1.5 * Math.PI);
        }
    	context.globalCompositeOperation='destination-over';
    	context.strokeStyle = "#000";
    	context.lineWidth=this.state.nodeLineWidth;
    	context.stroke();
    	context.globalCompositeOperation='source-over';
    }
    _addNodes(){
        let self = this;
        this.state.jobs.map(function(job) {
            var color = '#ddd';
            if (job.state === 1)
                color = '#70f441';
            else if (job.state === 0)
                color = '#f4dc42';
            else if (job.state === 2)
                color = '#f45f41';
            self._drawNode(color, job);
        });
        circles = this.state.nodes;
    }
    componentWillMount() {
        this._loadJobs();
        this._drawGrid();
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
                {this._addNodes()}
                {this.state.nodes.map(function(node) {
                    var nodeId = node.id;
                    return (
                        <div id={nodeId+"-content"} className="dropdown-content" key={nodeId+"-content"} style={{left: node.x, top: node.y}}>
	                        <div>Platform: {node.category}</div>
	                        <div>Job Name: {node.ref}</div>
	                        <div>Job Status: {node.status}</div>
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
            </div>
        );
    }
}
ReactDOM.render(
    <JobsMap />,
    document.getElementById('reactJobsMap')
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
    //clear the contents and rerender the Map
    document.getElementById('reactJobsMap').innerHTML = "";
    ReactDOM.render(
    <JobsMap />,
    document.getElementById('reactJobsMap')
);
};

