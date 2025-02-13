"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const Header = () => {
  const path = usePathname();

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm">
      <Image src={"/logo.svg"} width={50} height={50} className="pl-4" />

      <ul className="hidden md:flex gap-8 text-lg">
        <li
          className={`hover:text-blue-600 hover:font-semibold transition-all cursor-pointer ${
            path == "/dashboard" && "text-blue-700 font-semibold"
          }`}
        >
          Dashboard
        </li>
        {/* <li
          className={`hover:text-blue-600 hover:font-semibold transition-all cursor-pointer ${
            path == "/questions" && "text-slate-600 font-semibold"
          }`}
        >
          Questions
        </li>
        <li
          className={`hover:text-blue-600 hover:font-semibold transition-all cursor-pointer ${
            path == "/upgrade" && "text-slate-600 font-semibold"
          }`}
        >
          Upgrade
        </li>
        <li
          className={`hover:text-blue-600 hover:font-semibold transition-all cursor-pointer ${
            path == "/working" && "text-slate-600 font-semibold"
          }`}
        >
          How it works?
        </li> */}
      </ul>
      <div className="pr-2">
        <UserButton />
      </div>
    </div>
  );
};

export default Header;
