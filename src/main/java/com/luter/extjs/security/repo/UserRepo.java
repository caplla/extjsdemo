package com.luter.extjs.security.repo;

import com.luter.extjs.entity.sys.TSUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<TSUser, String> {
    TSUser findTSUserByUsername(String username);
}
