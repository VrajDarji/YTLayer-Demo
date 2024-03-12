import React from "react";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import Login from "@/components/login";
import Image from "next/image";
import Logout from "@/components/logout";
import UploadVideo from "@/components/UploadVideo";

const Page = async () => {
  const session = await getServerSession(authConfig);

  return (
    <>
      {session ? (
        <>
          <Image
            src={session?.user?.image as string}
            width={50}
            height={40}
            alt=""
          />
          <p>Welcome {session?.user?.name}</p>
          <UploadVideo />
          <Logout />
        </>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Page;
