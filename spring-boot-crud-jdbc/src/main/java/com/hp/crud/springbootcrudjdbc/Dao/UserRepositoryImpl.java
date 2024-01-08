package com.hp.crud.springbootcrudjdbc.Dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hp.crud.springbootcrudjdbc.Model.User;
@Repository
public class UserRepositoryImpl implements UserRepository {
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	private static final String INSERT_USER_QUERY = "INSERT INTO \"User\" (fname, lname, email,number,filename) VALUES (?, ?, ?,?,?)";
	private static final String UPDATE_USER_QUERY = "UPDATE \"User\" SET fname=?, lname=?, email=?,number=?,filename=? WHERE id=?";
	private static final String DElETE_USER_BY_ID_QUERY="DELETE FROM \"User\" WHERE id=?";
	private static final String GET_USER_BY_ID_QUERY="SELECT * FROM \"User\" WHERE id=?";
	private static final String GET_USER_QUERY = "SELECT * FROM \"User\"" ;
	

	
	@Override
	public User saveUser(User user) {
		jdbcTemplate.update(INSERT_USER_QUERY,user.getFname(),user.getLname(),user.getEmail(),user.getNumber(),user.getFilename());
		return user;
	}

	@Override
	public User updateUser(User user,int id) {
		 jdbcTemplate.update(UPDATE_USER_QUERY, user.getFname(), user.getLname(), user.getEmail(), user.getNumber(),user.getFilename(), id);
	        return user;
		
	}
	
	@Override
	public String deleteUser(int id) {
		jdbcTemplate.update( DElETE_USER_BY_ID_QUERY,id);
		return "record deleted";
	}

	@Override
	public User getUserById(int id) {
	    return jdbcTemplate.queryForObject(GET_USER_BY_ID_QUERY, (rs, rowNum) -> {
	        return new User(
	            rs.getInt("id"),
	            rs.getString("fname"),
	            rs.getString("lname"),
	            rs.getString("email"),
	            rs.getInt("number"),  
	            rs.getString("filename")
	        );
	    }, id);
	}

	
	

	@Override
	public List<User> getAllUsers() {
		return jdbcTemplate.query(GET_USER_QUERY, (rs,rowNum)->{
			return new User(rs.getInt("id"),rs.getString("fname"),rs.getString("lname"),rs.getString("email"),rs.getInt("number"),rs.getString("filename"));
		});
		
	}
	}
