package com.luter.extjs.security.repo;


import com.luter.extjs.entity.sys.TSUser;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserReposiroty extends PagingAndSortingRepository<TSUser, String> {
    TSUser findTSUserByUsername(String username);
}
