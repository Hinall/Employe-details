package com.hp.crud.springbootcrudjdbc.Controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.io.ByteArrayOutputStream;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;
import java.nio.file.Files;
import java.io.File;

import org.apache.tomcat.util.json.JSONParser;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import com.hp.crud.springbootcrudjdbc.Dao.UserRepository;
import com.hp.crud.springbootcrudjdbc.Model.User;
@RestController
public class UserController {
	@Autowired
	UserRepository userRepository;
	
	
	
	@PostMapping("/user")
	public User addUser(@RequestParam ("empData") String empData,@RequestParam ("image") MultipartFile file) throws IOException, JSONException {
			
			String originalFilename= file.getOriginalFilename();
	        String uploadDirectory=System.getProperty("user.dir")+"/src/main/webapp/images";
	        Path filenameAndPath=Paths.get(uploadDirectory,originalFilename);
			Files.write(filenameAndPath, file.getBytes());
	        
	        User user=new User();
	        JSONObject json_obj = new JSONObject(empData);
	        user.setFname(json_obj.getString("fname"));
	        user.setLname(json_obj.getString("lname"));
	        user.setEmail(json_obj.getString("email"));
	        user.setNumber(json_obj.getInt("number"));
	       
	        
	        user.setFilename(originalFilename);
	        return userRepository.saveUser(user);
	}
	

    @PutMapping("/userUpdate/{id}")
    public User updateUser(@RequestParam ("empData") String empData,@RequestParam ("image") MultipartFile file, @PathVariable("id") int id) throws JSONException, IOException {
    	  User user=new User();
    	  JSONObject json_obj = new JSONObject(empData);
	        user.setFname(json_obj.getString("fname"));
	        user.setLname(json_obj.getString("lname"));
	        user.setEmail(json_obj.getString("email"));
	        user.setNumber(json_obj.getInt("number"));
	        
	        String originalFilename= file.getOriginalFilename();
	        String uploadDirectory=System.getProperty("user.dir")+"/src/main/webapp/images";
	        Path filenameAndPath=Paths.get(uploadDirectory,originalFilename);
			Files.write(filenameAndPath, file.getBytes());
        return userRepository.updateUser(user, id);
    }
	@GetMapping("/user/{id}")
	public User getUser(@PathVariable("id") int id) {
		return userRepository.getUserById(id);
	}
	
	@GetMapping("/user")
	public List<User> getUsers(User user) {
		return userRepository.getAllUsers();
	}
	@DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable("id") int id) {
         userRepository.deleteUser(id);
         return "user deleted";}

@GetMapping("/userImage/{id}")
public ResponseEntity<byte[]> getUserImage(@PathVariable int id) throws IOException {
	
	//get student object from repository
	User user1=userRepository.getUserById(id);
	//get the image path from student object
	String uploadDirectory=System.getProperty("user.dir")+"/src/main/webapp/images";
	//Path imagePath=Paths.get(uploadDirectory,user1.getFilename());
	
	BufferedImage bImage = ImageIO.read(new File(uploadDirectory + user1.getFilename()));
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    ImageIO.write(bImage, "png", bos );
    byte [] data = bos.toByteArray();
		
	return new ResponseEntity<byte[]>(data , HttpStatus.OK);
}
	
}
