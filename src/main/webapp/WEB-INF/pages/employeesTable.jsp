<!DOCTYPE html>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>1) Employee List</title>
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
        <h3>1) All Employees Example</h3>
        <h4>ReactJS View, with MongoDB model, and REST API</h4>
        <p>The view is rendered via ReactJS by returning a standard HTML table</p>
        <p>The data in the table is fetched from a remote REST API</p>
    </div>
    <div id="reactContent"></div>

    <script src="${pageContext.request.contextPath}/resources/js/getEmployeesTable.js" type = "text/babel"></script>
    <script>
        window.onmousemove = function (e) {
            var x = (e.clientX + 20) + 'px';
            var y = (e.clientY + 20) + 'px';
            $('.dropdown-content').css('left', x);
            $('.dropdown-content').css('top', y);
        };
    </script>
    
    <form:form method="POST" action="/springMVC/all" modelAttribute="employee">
        <label>Enter the Employee ID to view the employee details: </label>
        <form:input path="empId" name="empId" />
        <input type="submit" value="View">
    </form:form>
        
    <div id="reactFooter"></div>
    <script src="${pageContext.request.contextPath}/resources/js/getPageFooter.js" type = "text/babel"></script>
</body>
</html>