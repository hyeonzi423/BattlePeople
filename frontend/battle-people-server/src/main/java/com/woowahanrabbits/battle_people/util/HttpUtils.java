package com.woowahanrabbits.battle_people.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

public class HttpUtils {
	static class CustomCookie extends Cookie {
		public CustomCookie(String name, String value, String path, int maxAge) {
			super(name, value);
			setPath(path);
			setMaxAge(maxAge);
		}
	}

	public static final Cookie accessTokenRemovalCookie = new CustomCookie("access", null, "/", 0);
	public static final Cookie refreshTokenRemovalCookie = new CustomCookie("refresh", null,
		"/battle-people/auth/refresh", 0);

	public static Cookie createCookie(String name, String value, String path) {
		Cookie cookie = new CustomCookie(name, value, path, 864000);
		cookie.setHttpOnly(true);
		cookie.setSecure(true);
		return cookie;
	}

	public static void deleteCookies(HttpServletResponse response, Cookie... cookies) {
		for (Cookie cookie : cookies) {
			cookie.setMaxAge(0);
			response.addCookie(cookie);
		}
	}
}
