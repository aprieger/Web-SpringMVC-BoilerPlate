var canvas = document.getElementById('mapCanvas');
var context = canvas.getContext('2d');
var circles = [];

var p = $('#canvasStart');
var position = p.position();
var canvasY0 = position.top;
var canvasX0 = position.left;

class JobsMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            nodes: [],
            scale: 220,
            nodeLineCount: 0,
            nodeX: -.3,
            nodeY: .7,
            nodeDirection: "right",
            nodeRadius: 10,
            nodeLineWidth: 5,
            boxWidth: 180,
            boxHeight: 180
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
        var windowHeight = ((this.state.boxWidth)*this.state.jobs.length)/(window.innerWidth/600);
        context.canvas.height = windowHeight;
    }
    _drawNode(job) {
        var self = this;
        var status;
        var color = '#ddd';
        if (job.state === 0) {
            color = "#f4dc42";
            status = "Job In Progress";
        }
        else if (job.state === 1) {
            color = "#70f441";
            status = "Job Completed";
        }
        else if (job.state === 2) {
            color = "#f45f41";
            status = "Job Failed";
        }
            
        if (canvas.width < (this.state.nodeLineCount+2)*this.state.scale*.85) {
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
        context.fillStyle = color;
        context.fill();
        context.stroke();
	    	
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
            color: color,
            radius: self.state.nodeRadius,
            boxWidth: self.state.boxWidth
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
            self._drawNode(job);
        });
        circles = this.state.nodes;
    }
    componentWillMount() {
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
                {this._drawGrid()}
                {this._addNodes()}
                {this.state.nodes.map(function(node) {
                    var nodeId = node.id;
                    return (
                        <div>
                            <div id={nodeId+"-content"} className="map-content" 
                                key={nodeId+"-content"} 
                                style={{left: node.x+canvasX0-(node.boxWidth/2), 
                                    top: node.y+canvasY0-(node.boxWidth/2),
                                    width: node.boxWidth,
                                    height: node.boxWidth}}>
                                <table className="table table-condensed">
                                        <tr>
                                            <td style={{backgroundColor: node.color, padding: '.5em'}}></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div style={{textDecoration: "underline", weight: "600"}}>Job: {node.ref}</div>
                                                <div>Platform: {node.category}</div>  
                                                <div>Status: {node.status}</div>
                                                <div>Dependencies:</div>
                                                {node.dependencies.map(function(ref) {
                                                    return (
                                                    <div>{ref.ref}</div>
                                                    );
                                                })}
                                            </td>
                                        </tr>
                                </table>
                            </div>
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
    document.getElementById('reactJobsMap'));
    var elements = document.querySelectorAll('.map-content');
    for(var i=0; i<elements.length; i++){
        elements[i].style.display = "block";
    }
};

