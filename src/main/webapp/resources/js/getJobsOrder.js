var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var circles = [];

class JobsOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            circlesArray: [],
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
        context.canvas.width = window.innerWidth-(window.innerWidth*.1);
        context.canvas.height = window.innerHeight-(window.innerHeight*.1);
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
        context.closePath();
    }
    _drawNode(nodeFill, nodeJob) {
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
    	context.fillStyle = nodeFill;
    	context.fill();
    	context.stroke();
        this.state.circlesArray.push({
            id: x + "-" + y,
            jobId: nodeJob.id,
            category: nodeJob.category,
            type: nodeJob.type,
            ref: nodeJob.ref,
            state: nodeJob.state,
            priority: nodeJob.priority,
            dependencies: nodeJob.dependencies,
            x: x,
            y: y,
            radius: this.state.nodeRadius
        });
        this.state.nodeLineCount++;
    }
    _drawLine(){
        var lineX = this.state.nodeX*this.state.scale;
        var lineY = this.state.nodeY*this.state.scale;
        context.beginPath();
        
        if (this.state.nodeDirection==="right") {
            context.moveTo(lineX-this.state.nodeRadius, lineY);
            context.lineTo(lineX - (this.state.scale-this.state.nodeRadius), lineY);
        }
        else if (this.state.nodeDirection==="left") {
            context.moveTo(lineX+this.state.nodeRadius, lineY);
            context.lineTo(lineX + (this.state.scale-this.state.nodeRadius), lineY);
        }
    	context.strokeStyle = "#000";
    	context.lineWidth=this.state.nodeLineWidth;
    	context.stroke();
    }
    
    _drawLoopBackLine(){
        var lineX = this.state.nodeX*this.state.scale;
        var lineY = (this.state.nodeY-.5)*this.state.scale;
        context.beginPath();
        
        if (this.state.nodeDirection==="right") {
            context.arc(lineX+this.state.nodeRadius, lineY, this.state.scale/2, 1.5 * Math.PI, .5 * Math.PI);
        }
        else if (this.state.nodeDirection==="left") {
            context.arc(lineX-this.state.nodeRadius, lineY, this.state.scale/2, .5 * Math.PI, 1.5 * Math.PI);
        }
    	context.strokeStyle = "#000";
    	context.lineWidth=this.state.nodeLineWidth;
    	context.stroke();
    }
    _addNodes(){
        let self = this;
        this.state.jobs.map(function(job) {
            var color = '#fff';
            if (job.state === 1)
                color = '#70f441';
            else if (job.state === 0)
                color = '#f4dc42';
            else if (job.state === 2)
                color = '#f45f41';
            self._drawNode(color, job);
        });
        circles = this.state.circlesArray;
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
                {this._addNodes()}
                {this.state.circlesArray.map(function(circle) {
                    var circleId = circle.id;
                    return (
                        <div id={circleId+"-content"} className="dropdown-content" key={circleId+"-content"}>
                            <div>Category: {circle.category}</div>
                            <div>Type: {circle.type}</div>
                            <div>Reference: {circle.ref}</div>
                            <div>State: {circle.state}</div>
                            <div>Priority: {circle.priority}</div>
                            <div>Dependencies:</div>
                            {circle.dependencies.map(function(ref) {
                            	return (
                                    <div>{ref}</div>
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
    <JobsOrder />,
    document.getElementById('reactJobsOrder')
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
            $('#'+circle.id+'-content').css('left', x+20+"px");
            $('#'+circle.id+'-content').css('top', y+20+"px");
            $('#'+circle.id+'-content').css('display', 'block');
            break;
        }
    }
};

