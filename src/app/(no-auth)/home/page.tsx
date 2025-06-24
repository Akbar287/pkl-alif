import About from "@/components/website/halaman_utama/About";
import Advantages from "@/components/website/halaman_utama/Advantages";
import Hero from "@/components/website/halaman_utama/Hero";
import React from "react";

const Page = () => {
  return (
    <div className="from-green-50 via-yellow-50 bg-gradient-to-br to-red-50 dark:from-gray-800 dark:via-gray-600 dark:to-gray-700">
      <Hero />
      <div className="from-green-50 via-yellow-50 bg-gradient-to-br to-red-50 dark:from-gray-800 dark:via-gray-600 dark:to-gray-700">
        <About />
        <Advantages />
      </div>
    </div>
  );
};

export default Page;
