"use client";
import { signOut } from "next-auth/react";
import React from "react";

const Logout = () => {
  const handleClick = () => {
    signOut();
  };
  return <button onClick={handleClick}>Logout</button>;
};

export default Logout;
