"use client";
import React from "react";
import { signIn } from "next-auth/react";
const Login = () => {
  const handleClick = () => {
    signIn("google");
  };
  return (
    <div>
      <button onClick={handleClick}>Login with google</button>
    </div>
  );
};

export default Login;
