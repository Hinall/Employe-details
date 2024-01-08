package com.hp.crud.springbootcrudjdbc.Dao;

import java.util.List;

import com.hp.crud.springbootcrudjdbc.Model.User;

public interface UserRepository {
	
	User saveUser(User user);
	User updateUser(User user,int id);
	User getUserById(int id);
	List<User> getAllUsers();
	String deleteUser(int id);
	

}
