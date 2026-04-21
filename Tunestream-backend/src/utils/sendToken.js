export const sendAccessToken = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, 
    sameSite: "strict", 
    maxAge: 15 * 60 * 1000,
    path: "/", 
  });
};

export const sendRefreshToken = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
};