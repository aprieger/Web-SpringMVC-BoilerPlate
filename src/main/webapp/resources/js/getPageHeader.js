class PageHeader extends React.Component {
    render() {     
        var resourcePath=document.getElementById('resourcesPath');
        return (
            <div className="nav-container">
	            <img src={resourcePath.href+"/img/logo.png"} alt="logo" className="logoImg"></img>
	            <ul>
	                <li><h2 className="title">Example 3: Job Map</h2></li>
	                <li><a href="/springMVC/">Home</a></li>
	                <li><a href="/springMVC/employee/table">1) Employee Table</a></li>
	                <li><a href="/springMVC/employee/map">2) Employee Map</a></li>
	                <li><a href="/springMVC/job/map">3) Job Map</a></li>
	            </ul>
            </div>
        );
    }
};
ReactDOM.render(
    <PageHeader />,
    document.getElementById('reactPageHeader')
);