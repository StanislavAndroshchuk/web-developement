'use client'
import { NAV_LINKS } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import Button from "./Button"
import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';

const Navbar = () => {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken: any = jwt.decode(token);
        const currentTime = Date.now().valueOf() / 1000;

        if (decodedToken.exp && decodedToken.exp >= currentTime) {
          setIsLogged(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLogout = (element) => {
    localStorage.removeItem('token');
    setIsLogged(false);
    // якщо потрібно, ви можете перенаправити користувача на головну сторінку або сторінку логіна після виходу
    // router.push('/login');
  };

  return (
    
    <nav className="flexBetween max-container padding-container relative z-30 py-5">
      <Link href="/">
        <Image src="/Logo.png" alt="logo" width={74} height={29} />
      </Link>
      <ul className="hidden h-full gap-12 lg:flex ">
        {NAV_LINKS.map((link) => (
          <Link href={link.href} key={link.key} className="regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold">
            {link.label}
          </Link>
        ))}
      </ul>

      <div className="lg:flexCenter hidden">
      {isLogged ? (
        <Button 
          type="button"
          title="Logout"
          icon="/user.svg"
          variant="btn_dark_green"
          onClick={() =>handleLogout(null)}
        />
      ) : (
        <Link href='/login'>
          <Button 
            type="button"
            title="Login"
            icon="/user.svg"
            variant="btn_dark_green"
          />
        </Link>
      )}
    </div>
      <Image 
        src="menu.svg"
        alt="menu"
        width={32}
        height={32}
        className="inline-block cursor-pointer lg:hidden"
      />
    </nav>
  )
}

export default Navbar