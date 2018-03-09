class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {employees: []}
    }
    _loadEmployees() {
        $.ajax({
            url: 'http://localhost:8080/employee/all',
            dataType: 'json',
            success: function(data) {
                this.setState({employees: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('#Get Error', status, err.toString());
            }.bind(this)
        });
    }
    _orderEmployees() {
        this.state.employees.sort(function(empA, empB){
            if (empA.empId < empB.empId)
                return -1;
            else if (empA.empId > empB.empId)
                return 1;
            return 0;
        });
    }
    componentDidMount() {
        this._loadEmployees();
    }
    
    render() {
        //var self = this;
        var data=["EmpID","Name","Status","Tenure","Phone","Email","DOJ",
            "WL","HL","CL","RMID","RoleID","VertID","AcctID"];
        var tableData = [];
        for (var x = 0; x < data.length; x++)
            tableData.push(<th>{data[x]}</th>);
        
        return (
            <div>
                <table id="empTable" className="table table-striped">
                    <thead>
                        <tr>{tableData}</tr>
                    </thead>
                    <tbody>
                        {this._orderEmployees()}
                        {this.state.employees.map(function(employee) {
                            var color = '';
                            if (employee.status === "Onboarding Completed")
                                color = '#70f441';
                            else if (employee.status === "Onboarding In Progress")
                                color = '#f4dc42';
                            else if (employee.status === "Onboarding Cancelled")
                                color = '#f45f41';
                            var colorStyle = { backgroundColor: color };
                            return (
                                <tr className="dropdown" key={employee.empId}>
                                    <td>{employee.empId.toString()}</td>
                                    <td>{employee.name}</td>
                                    <td style={colorStyle}>{employee.status}</td>
                                    <td>{employee.tenure}</td>
                                    <td>{employee.phone}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.doj}</td>
                                    <td>{employee.wl}</td>
                                    <td>{employee.hl}</td>
                                    <td>{employee.cl}</td>
                                    <td>{employee.rmid}</td>
                                    <td>{employee.roleid}</td>
                                    <td>{employee.vertid}</td>
                                    <td>{employee.acctid}</td>
                                    <div className="dropdown-content">
                                        <div>Employee Id:{employee.empId}</div>
                                        <div>Name:{employee.name}</div>
                                        <div>Tenure: {employee.tenure}</div>
                                        <div style={colorStyle}>Status: {employee.status}</div>
                                        <div>Phone: {employee.phone}</div>
                                        <div>Email: {employee.email}</div>
                                        <div>DOJ: {employee.doj}</div>
                                        <div>WL: {employee.wl}</div>
                                        <div>HL: {employee.hl}</div>
                                        <div>CL: {employee.cl}</div>
                                        <div>RMID: {employee.rmid}</div>
                                        <div>RoleID: {employee.roleid}</div>
                                        <div>VertID: {employee.vertid}</div>
                                        <div>AcctID: {employee.acctid}</div>
                                    </div>    
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById('reactContent')
);