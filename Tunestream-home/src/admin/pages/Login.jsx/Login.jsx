import axios from "../utils/axios";

const login = async () => {
  const res = await axios.post("/user/login", {
    email,
    password
  });

  if (res.data.user.role !== "admin") {
    alert("Not admin");
    return;
  }

  alert("Login success");
};