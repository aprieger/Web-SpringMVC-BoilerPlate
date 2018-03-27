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
    <link href="${pageContext.request.contextPath}" id="resourcesPath">
    
</head>
<body>
    <div id="reactPageHeader"></div>
    <script src="${pageContext.request.contextPath}/resources/js/getPageHeader.js" type = "text/babel"></script>
        
    <!--<div id="reactJobsMapButtons"></div>
    <script src="${pageContext.request.contextPath}/resources/js/getJobsMapButtons.js" type = "text/babel"></script>
    
    <select id="displaySelect" onchange="displayHandler()">
    		<option value="0">Job Tree
  		<option value="1">Job Map
    </select>-->
    <div id="reactJobsTree"></div>
    <div id="reactJobsMap"></div>
    <canvas id="canvas" resize="true" data-paper-resize="true"></canvas>
    <script src="${pageContext.request.contextPath}/resources/js/getJobsTree.js" type = "text/babel"></script>
    
    <!--<script>
	function displayHandler() {
	    var x = document.getElementById("displaySelect").value.toString();
	    if (x == "0") {
	    		document.getElementById("reactJobsMap").style.display = "none";
	    		document.getElementById("reactJobsTree").style.display = "inline";
		}
		else if (x == "1") {
			document.getElementById("reactJobsTree").style.display = "none";
			document.getElementById("reactJobsMap").style.display = "inline";
		}
	}
	</script>-->
    
    <div id="reactPageFooter"></div>
    <script src="${pageContext.request.contextPath}/resources/js/getPageFooter.js" type = "text/babel"></script>
</body>
</html>