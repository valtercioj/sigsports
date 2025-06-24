/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaFacebookSquare,
} from "react-icons/fa";

import { Quicksand, Bebas_Neue } from "next/font/google";

const quicksand = Quicksand({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const bebas_neue = Bebas_Neue({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

export default function LayoutInicial({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className={`${quicksand.className} flex h-screen w-screen `}>
      <div className="flex h-full w-full flex-col lg:justify-between ">
        <div className="fixed z-50 flex w-screen bg-bgGray shadow-2xl">
          <nav className="z-50 w-full">
            <div className=" w-full px-4">
              <div className="flex w-full">
                <div className="flex w-full justify-between">
                  <div>
                    <Link href="/" className="flex items-center px-2 py-4">
                      <Image
                        src="/mascote.svg"
                        alt="Logo"
                        className="mr-2 h-8 w-8"
                        width={32}
                        height={32}
                      />
                    </Link>
                  </div>
                  <div
                    className={`${bebas_neue.className} dropShadow-100 hidden items-center gap-x-14 space-x-1 text-xl text-white-default md:flex`}
                  >
                    <a
                      href=""
                      className="flex items-center  transition duration-300 hover:border-b-4 hover:border-green-500"
                    >
                      MODALIDADES
                      <span className="ml-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99816 11.3125L13.5588 5.75184L12.4982 4.69118L7.99816 9.19118L3.49816 4.69118L2.4375 5.75184L7.99816 11.3125Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                    </a>
                    <a
                      href=""
                      className="flex items-center transition duration-300 hover:border-b-4 hover:border-green-500"
                    >
                      HORARIOS
                      <span className="ml-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99816 11.3125L13.5588 5.75184L12.4982 4.69118L7.99816 9.19118L3.49816 4.69118L2.4375 5.75184L7.99816 11.3125Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                    </a>
                    <a
                      href=""
                      className="flex items-center transition duration-300 hover:border-b-4 hover:border-green-500"
                    >
                      EQUIPES
                      <span className="ml-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99816 11.3125L13.5588 5.75184L12.4982 4.69118L7.99816 9.19118L3.49816 4.69118L2.4375 5.75184L7.99816 11.3125Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                    </a>
                    <Link
                      href="/login"
                      className="flex items-center transition duration-300 hover:border-b-4 hover:border-green-500"
                    >
                      LOGIN
                    </Link>
                  </div>
                  <div className="mr-24 hidden items-center gap-x-4 text-white-default md:flex">
                    <FaInstagram size={24} />
                    <FaLinkedin size={24} />

                    <FaTwitter size={24} />
                    <FaYoutube size={24} />
                    <FaFacebookSquare size={24} />
                  </div>
                </div>

                <div
                  className={`${
                    showMenu ? "hidden" : "flex"
                  } flex items-center md:hidden`}
                >
                  <button
                    type="button"
                    className="mobile-menu-button outline-none"
                    onClick={toggleMenu}
                  >
                    <svg
                      className="h-6 w-6 text-green-100 hover:text-green-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {showMenu && (
              <div className="mobile-menu flex">
                <ul className="absolute left-0 top-0 h-screen w-[80vw] bg-green-200 text-xl text-white-default">
                  <div className="flex py-4">
                    <a
                      href="#"
                      className="text-white flex items-center space-x-2 px-4"
                      title="Your App is cool"
                    >
                      <Image
                        src="/mascote.svg"
                        alt="Logo"
                        className="mr-2 h-8 w-8"
                        width={32}
                        height={32}
                      />
                      <span className="truncate whitespace-nowrap text-2xl font-extrabold">
                        SIG SPORTS
                      </span>
                    </a>
                  </div>
                  <li className="active">
                    <a
                      href="index.html"
                      className="text-white block bg-green-500 px-2 py-4 text-sm font-semibold"
                    >
                      MODALIDADES
                    </a>
                  </li>
                  <li>
                    <a
                      href="#services"
                      className="block px-2 py-4 text-sm transition duration-300 hover:bg-green-500"
                    >
                      HORARIOS
                    </a>
                  </li>
                  <li>
                    <a
                      href="#about"
                      className="block px-2 py-4 text-sm transition duration-300 hover:bg-green-500"
                    >
                      EQUIPES
                    </a>
                  </li>
                </ul>
                <button
                  type="button"
                  className="mobile-menu-button1 outline-none"
                  onClick={toggleMenu}
                >
                  <svg
                    className="absolute right-4 top-4 h-10 w-10 text-white-default hover:text-green-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
          </nav>
        </div>
        <div className="mt-52 flex h-full w-screen justify-center tablet:w-full">
          {children}
        </div>
      </div>
      <div className="invisible mt-10 flex w-0 flex-row-reverse flex-wrap justify-between overflow-hidden lg:w-2/4 tablet:visible">
        <img
          src="/background.svg"
          alt="Logo"
          className="absolute top-0 h-full overflow-hidden"
        />
        <img src="/text.svg" alt="Logo" className="absolute h-full" />
        <div className="invisible absolute mt-10 flex  w-full flex-wrap items-center justify-end tablet:visible">
          <img src="/women.svg" alt="Logo" className="h-full" />
        </div>
      </div>
    </div>
  );
}
