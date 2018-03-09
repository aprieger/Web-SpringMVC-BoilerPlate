package com.springmvc.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.springmvc.dto.Job2;

/**
 * @author sugyani
 * Controller class to resolve mapped urls
 *
 */
@Controller
@RequestMapping( value = "/job")
public class JobWebController {
	@RequestMapping(value = "/table", method = RequestMethod.GET)
	public String getJobsTable(Model model){
		model.addAttribute("job", new Job2());
		return "jobsTable";
	}
	@RequestMapping(value = "/order", method = RequestMethod.GET)
	public String getJobsOrder(Model model){
		model.addAttribute("job", new Job2());
		return "jobsOrder";
	}
	@RequestMapping(value = "/map", method = RequestMethod.GET)
	public String getJobsMap(){
		return "jobsMap";
	}
}