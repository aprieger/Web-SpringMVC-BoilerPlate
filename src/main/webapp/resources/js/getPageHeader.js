class PageHeader extends React.Component {
    render() {     
        var resourcePath=document.getElementById('resourcesPath');
        return (
        		<div>
	            <div className="nav-container" style={{background: 'linear-gradient(#fff, #efefef)', top: '0', height: '10%'}}>
		            <img src={resourcePath.href+"/img/logo.png"} alt="logo" className="logoImg"></img>
		            <h3 className="title">Example 3: Job Map</h3>
	            </div>
	            <div className="nav-container" style={{top: '10%'}}>
		            <ul>
			            <li><a href="/springMVC/">Home</a></li>
			            <li><a href="/springMVC/employee/table">1) Employee Table</a></li>
			            <li><a href="/springMVC/employee/map">2) Employee Map</a></li>
			            <li><a href="/springMVC/job/map">3) Job Map</a></li>
			        </ul>
			    </div>
		    </div>
        );
    }
};
ReactDOM.render(
    <PageHeader />,
    document.getElementById('reactPageHeader')
);