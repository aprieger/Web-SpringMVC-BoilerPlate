<!--    <script src="https://unpkg.com/react-router/umd/react-router.min.js"></script>
    <script src="https://unpkg.com/react-router-dom/umd/react-router-dom.min.js"></script>
    <script async="" data-main="/run.js" src="/bower_components/requirejs/require.js"></script>
    <script data-main="js/route" src="${pageContext.request.contextPath}/resources/js/require.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/require.js"></script>-->
<!--    <script src="${pageContext.request.contextPath}/resources/js/route.js" type = "text/babel"></script>
    <div id="reactRouter"></div>-->
<html>
<head>
    <meta charset="UTF-8"/>
    <title>ReactJS, MongoDB, RestAPI MVC Example App</title>
    <script src="https://fb.me/react-15.0.1.js"></script>
    <script src="https://fb.me/react-dom-15.0.1.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.34/browser.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <link href="${pageContext.request.contextPath}/resources/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/resources/bootstrap/custom.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}" id="resourcesPath">
</head>
<body>
    <div id="reactHeader"></div>
    <script src="${pageContext.request.contextPath}/resources/js/getPageHeader.js" type = "text/babel"></script>
    
    <div class="info">
        <div>
            <h3>1) Employee Table Example</h3>
            <h4>ReactJS View, with MongoDB model, and REST API</h4>
            <p>The view is rendered via ReactJS by returning a standard HTML table</p>
            <p>The data in the table is fetched from a remote REST API</p>
            <p>The status of each employee is fetched from the table, then the color changes according to what the status is</p>
            <p>Hidden employee information corresponds to each node, that shows when the user hovers, and uses JQuery to follow the user mouse</p>
        </div>
        <div>
            <h3>2) Employee Map Example</h3>
            <h4>ReactJS View, with MongoDB model, and REST API</h4>
            <p>The view is a canvas that is manipulated through ReactJS</p>
            <p>ReactJS draws a grid, nodes and connecting lines</p>
            <p>Hidden employee information corresponds to each node, that shows when the user hovers, and uses JQuery to follow the user mouse</p>
        </div>
        <div>
            <h3>3) Job Map Example</h3>
            <h4>ReactJS View, with MongoDB model, and REST API</h4>
            <p>The view is a canvas that is manipulated throught ReactJS, similar to example 2</p>
            <p>ReactJS draws a grid, and dynamically draws the nodes and the lines based on the dependencies of the job data received from the API</p>
            <p>Hidden job information corresponds to each node, that shows when the user hovers, and uses JQuery to follow the user mouse</p>
        </div>
    </div>
        
    <div id="reactFooter"></div>
    <script src="${pageContext.request.contextPath}/resources/js/getPageFooter.js" type = "text/babel"></script>
</body>
</html>
