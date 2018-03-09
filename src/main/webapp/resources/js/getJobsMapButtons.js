class ActionButtons extends React.Component {
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
            url: 'http://localhost:8080/job2/all',
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
    _addJob(ref){
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
        this._loadJobs();
    }
    
    componentDidMount() {

    }
    
    render() {
        return (
            <div>
                <button onClick={(e) => this._addJob("JobId", e)} className="btn btn-primary">Add Job</button>
                <button onClick={(e) => this._addAll(e)} className="btn btn-primary">Add All</button>
                <button onClick={(e) => this._deleteJob("JobId", e)} className="btn btn-danger">Delete Job</button>
                <button onClick={(e) => this._deleteAll(e)} className="btn btn-danger">Delete All</button>
            </div>
        );
    }
}
//Create a new Map object from the React class Component, and add it to the DOM
ReactDOM.render(
    <ActionButtons />,
    document.getElementById('reactButtons')
);