class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {employees: []};
    }

    loadEmployees() {
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
    componentDidMount() {
        this.loadEmployees();
    }

    render() {
        return (
            <div>
                {this.state.employees.map(function(employee) {
                    if (employee.empId === document.getElementById("hiddenEmpId").innerHTML) {
                        var color = '';
                            if (employee.status === "Onboarding Completed")
                                color = '#70f441';
                            else if (employee.status === "Onboarding In Progress")
                                color = '#f4dc42';
                            else if (employee.status === "Onboarding Cancelled")
                                color = '#f45f41';
                            var colorStyle = { backgroundColor: color };
                        return (
                            <div key={employee.empId}>
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
                        )
                    }
                })}
            </div>
        );
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById('reactContent')
)