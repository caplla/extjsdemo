package com.luter.extjs.security.shiro.endecrypt;


import com.luter.extjs.entity.sys.TSUser;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.springframework.util.Assert;
import org.thymeleaf.expression.Strings;

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

    public static boolean CheckUserMD5Password(String password, String salt, String md5cipherText) {
        Assert.hasText(password, "明文密码不能为空");
        Assert.hasText(salt, "盐不能为空");
        Assert.hasText(md5cipherText, "密文密码不能为空");
        String password_cipherText = new Md5Hash(password, salt, 100).toHex();
        return md5cipherText.equals(password_cipherText);
    }

}
