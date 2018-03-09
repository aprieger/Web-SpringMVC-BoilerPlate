package com.springmvc.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.springmvc.dto.Employee;

/**
 * @author sugyani
 * Controller class to resolve mapped urls
 *
 */
@Controller
@RequestMapping( value = "/employee")
public class EmployeeWebController {
	@RequestMapping(value = "/table", method = RequestMethod.GET)
	public String getEmployeesTable(Model model){
		model.addAttribute("employee", new Employee());
		return "employeesTable";
	}
	@RequestMapping(value = "/table", method = RequestMethod.POST)
    public String postEmployeeDetails(@ModelAttribute("employee") Employee employee, BindingResult result, Model model, HttpServletRequest request) {
        if (result.hasErrors()) {
            return "employeesTable";
        }
        else {
	        model.addAttribute("empId", employee.getEmpId());
	        return "employeeDetails";
        }
    }
	@RequestMapping(value = "/details", method = RequestMethod.GET)
	public String getGmployeeDetails(Model model){
		return "employeesDetails";
	}
	@RequestMapping(value = "/map", method = RequestMethod.GET)
	public String getEmployeesMap(){
		return "employeesMap";
	}
}