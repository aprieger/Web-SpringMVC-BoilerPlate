class JobsMapButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allJobs: [],
            addedJobs: [],
            availableJobs: []
        };
    }
    
    _loadJobs() {
        $.ajax({
            url: 'http://localhost:8080/jobs/all',
            dataType: 'json',
            success: function(data) {
                this.setState({allJobs: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('#Get Error', status, err.toString());
            }.bind(this),
            async: false
        });
    }
    _loadLocalJobs() {
        var resourcesPath = document.getElementById("resourcesPath").getAttribute("href");
        $.ajax({
            url: resourcesPath+'/resources/js/JobList.json',
            dataType: 'json',
            success: function(data) {
                this.setState({allJobs: data});
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({allJobs: []});
            }.bind(this),
            async: false
        });
    }
    _getJobs() {
        
    }
    _writeChanges() {
        
    }
    _addJob(ref){
        this.state.allJobs.map(function(job) {
            if (job.ref === ref)
                job.scheduled = 1;
                job.state = 1;
            });
        this._writeChanges;
        alert("Added "+ref);
    }
    _addAll(){
        alert("Added All ");
    }
    _deleteJob(ref){
        alert("Deleted "+ref);
    }
    _deleteAll(){
        alert("Deleted All ");
    }

    componentWillMount() {
        //this._loadJobs();
        this._loadLocalJobs();
    }
    
    componentDidMount() {

    }
    
    render() {
        return (
            <div>
                <button onClick={(e) => this._addJob("JOB1", e)} className="btn btn-primary">Add Job</button>
                <button onClick={(e) => this._addAll(e)} className="btn btn-primary">Add All</button>
                <button onClick={(e) => this._deleteJob("JobId", e)} className="btn btn-danger">Delete Job</button>
                <button onClick={(e) => this._deleteAll(e)} className="btn btn-danger">Delete All</button>
            </div>
        );
    }
}
//Create a new Map object from the React class Component, and add it to the DOM
ReactDOM.render(
    <JobsMapButtons />,
    document.getElementById('reactJobsMapButtons')
);