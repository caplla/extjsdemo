package com.luter.extjs.security.repo;


import com.luter.extjs.entity.sys.TSResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ResourceRepository extends JpaRepository<TSResource, String> {
    @Query(value = "select p.*  from t_sys_resource p where id in (select rp.resource from t_sys_role_resource   " +
            " rp where rp.role in(select ru.role from t_sys_role_user ru where ru.user=?1) " +
            " and p.res_type='perm')",
            nativeQuery = true)
    List<TSResource> getUserPerms(String user_id);

    @Query(value = "select r.* from t_sys_resource r where r.res_type='perm'",
            nativeQuery = true)
    List<TSResource> getAllPerms();
}
