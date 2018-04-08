package com.luter.extjs.security.repo;

import com.luter.extjs.entity.sys.TSResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ResourceRepo extends JpaRepository<TSResource, String> {

    @Query(value = "select p.*  from t_s_resource p where id in (select rp.resource from t_s_role_resource   " +
            " rp where rp.role in(select ru.role from t_s_role_user ru where ru.user=?1) " +
            " and p.res_type='perm')",
            nativeQuery = true)
    List<TSResource> getUserResourcesByUserID(String userId);
    @Query(value = "select r.* from t_s_resource r where r.res_type='perm'", nativeQuery = true)
    List<TSResource> getAllPerms();
}
