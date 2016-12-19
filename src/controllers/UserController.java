package controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import data.UserDAO;
import entities.Deadline;
import entities.User;

@RestController
public class UserController {

	@Autowired
	UserDAO userdao;
	
	@RequestMapping(value="ping", method=RequestMethod.GET)
	public String ping(){
		return "pong";
	}
	
	@RequestMapping(path="users/{id}", method=RequestMethod.GET)
	public User show(@PathVariable int id){
		return userdao.show(id);
	}
	
	@RequestMapping(path="users/verify", method=RequestMethod.POST)
	public User verify(@RequestBody String userJSON){
		System.out.println(userJSON);
		ObjectMapper mapper = new ObjectMapper();
		User u = null;
		try{
			u = mapper.readValue(userJSON, User.class);
		}catch(Exception e){
			System.out.println(e);
		}
		
		return userdao.verify(u.getName(), u.getPassword());
	}
	
	@RequestMapping(path="users", method=RequestMethod.POST)
	public User create(@RequestBody String userJSON){
		
		ObjectMapper mapper = new ObjectMapper();
		User u = null;
		try{
			u = mapper.readValue(userJSON, User.class);
		}catch(Exception e){
			System.out.println(e);
		}
		
		return userdao.create(u);
	}
	
	@RequestMapping(path="users/{id}", method=RequestMethod.PUT)
	public User update(@PathVariable int id, @RequestBody String userJSON){
		
		ObjectMapper mapper = new ObjectMapper();
		User u = null;
		try{
			u = mapper.readValue(userJSON, User.class);
		}catch(Exception e){
			System.out.println(e);
		}
		
		return userdao.update(id, u);
		
	}
	
	@RequestMapping(path="users/{id}", method=RequestMethod.DELETE)
	public void destroy(@PathVariable int id){
		userdao.destroy(id);
	}
	
	@RequestMapping(path="users/{id}/dls", method=RequestMethod.GET)
	public List<Deadline> showDeadlines(@PathVariable int id){
		return userdao.showDeadlines(id);
	}
	
	@RequestMapping(path="users/{uId}/dls/{dlId}", method=RequestMethod.GET)
	public Deadline showDeadline(@PathVariable int uId, @PathVariable int dlId){
		List<Deadline> deadlines = userdao.showDeadlines(uId);
		Deadline rd = new Deadline();
		for(Deadline dl : deadlines){
			if(dl.getId() == dlId){
				rd = dl;
			}
		}
		
		return rd;
	}
	
	@RequestMapping(path="users/{id}/dls", method=RequestMethod.POST)
	public Deadline createDeadline(@PathVariable int id, @RequestBody String dlJSON){
		
		ObjectMapper mapper = new ObjectMapper();
		Deadline dl = null;
		try{
			dl = mapper.readValue(dlJSON, Deadline.class);
		}catch(Exception e){
			System.out.println(e);
		}
		
		return userdao.createDeadline(id, dl);
	}
	
	@RequestMapping(path="users/{userId}/dls/{dlId}", method=RequestMethod.PUT)
	public Deadline updateDeadline(@PathVariable int userId, @PathVariable int dlId, @RequestBody String dlJSON){
		
		ObjectMapper mapper = new ObjectMapper();
		Deadline dl = null;
		try{
			dl = mapper.readValue(dlJSON, Deadline.class);
		}catch(Exception e){
			System.out.println(e);
		}
		
		return userdao.updateDeadline(userId, dlId, dl);
	}
	
	@RequestMapping(path="users/{userId}/dls/{dlId}", method = RequestMethod.DELETE)
	public void destroyDeadline(@PathVariable int userId, @PathVariable int dlId){
		userdao.destroyDeadline(userId, dlId);
	}
	
}
