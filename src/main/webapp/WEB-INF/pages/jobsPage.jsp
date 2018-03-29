<!DOCTYPE html>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>Job Map</title>
    <script src="https://fb.me/react-15.0.1.js"></script>
    <script src="https://fb.me/react-dom-15.0.1.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.34/browser.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <link href="${pageContext.request.contextPath}/resources/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/resources/bootstrap/custom.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/resources/" id="resourcesPath">  
</head>
<body>
    <div id="reactPageHeader"></div>
    <script src="${pageContext.request.contextPath}/resources/js/getPageHeader.js" type = "text/babel"></script>
    
    <div class="main">  
        <!--<div id="reactJobsMapButtons"></div>
        <script src="${pageContext.request.contextPath}/resources/js/getJobsMapButtons.js" type = "text/babel"></script>
        -->
        <div class="info">
            <h3>3) Job Map Example</h3>
            <h4>ReactJS View, with MongoDB model, and REST API</h4>
            <p>The view is a canvas that is manipulated throught ReactJS, similar to example 2</p>
            <p>ReactJS draws a grid, and dynamically draws the nodes and the lines based on the dependencies of the job data received from the API</p>
            <p>Hidden job information corresponds to each node, that shows when the user hovers, and uses JQuery to follow the user mouse</p>
        </div>
        <select id="displaySelect" onchange="displayHandler()">
                    <option value="0">Job Tree
                    <option value="1">Job Map
        </select>
        <div id="reactJobsTree"></div>
        <div id="reactJobsMap"></div>
        <canvas id="treeCanvas" data-paper-resize="true"></canvas>
        <canvas id="mapCanvas" data-paper-resize="true" style="display: none"></canvas>
        <script src="${pageContext.request.contextPath}/resources/js/getJobsMap.js" type = "text/babel"></script>
        <script src="${pageContext.request.contextPath}/resources/js/getJobsTree.js" type = "text/babel"></script>

        <script>
            function displayHandler() {
                var x = document.getElementById("displaySelect").value.toString();
                if (x == "0") {
                    document.getElementById("mapCanvas").style.display = "none";
                    document.getElementById("reactJobsMap").style.display = "none";
                    document.getElementById("treeCanvas").style.display = "inline";
                    document.getElementById("reactJobsTree").style.display = "inline";
                }
                else if (x == "1") {
                    document.getElementById("treeCanvas").style.display = "none";
                    document.getElementById("reactJobsTree").style.display = "none";
                    document.getElementById("mapCanvas").style.display = "inline";
                    document.getElementById("reactJobsMap").style.display = "inline";
                }
            }
        </script>
    </div>
            
    <div id="reactPageFooter"></div>
    <script src="${pageContext.request.contextPath}/resources/js/getPageFooter.js" type = "text/babel"></script>
</body>
</html>