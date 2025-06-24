import React from "react";
import Foto from "@/assets/images.jpeg";
import Logo from "@/assets/logo-kemenkeu.png";
import Image from "next/image";
import RegisterForm from "@/components/auth/register-form";

const Page = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 from-green-50 via-yellow-50 bg-gradient-to-br to-red-50 dark:from-gray-800 dark:via-gray-600 dark:to-gray-700">
      <div className="flex flex-col gap-4 p-6 md:p-10 overflow-y-auto h-screen">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex items-center justify-center rounded-md">
              <Image src={Logo} alt="logo" width={200} height={100} />
            </div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full ">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={Foto}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Page;
