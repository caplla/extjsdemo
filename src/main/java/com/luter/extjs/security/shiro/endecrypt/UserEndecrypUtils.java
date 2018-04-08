package com.luter.extjs.security.shiro.endecrypt;


import com.luter.extjs.entity.sys.TSUser;
import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.Md5Hash;

public class UserEndecrypUtils {

    public static TSUser CreateUserWithUsernameAndMD5Password(String username, String password) {
        SecureRandomNumberGenerator secureRandomNumberGenerator = new SecureRandomNumberGenerator();
        String salt = secureRandomNumberGenerator.nextBytes().toHex();
        String password_cipherText = new Md5Hash(password, salt, 100).toHex();
        TSUser user = new TSUser();
        user.setUsername(username);
        user.setPassword(password_cipherText);
        user.setSalt(salt);
        user.setLocked(false);
        return user;
    }


}
