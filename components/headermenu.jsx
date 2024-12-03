"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";

export function HeaderMenu() {
  const { user, loading } = useAuth();

  // Placeholder while loading authentication state
  if (loading) {
    return (
      <header className="bg-white shadow-sm fixed w-full z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="text-2xl font-bold">Trade Buddy</div>
          <nav className="hidden md:flex space-x-4">
            <span className="text-gray-400 animate-pulse">Loading...</span>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm fixed w-full z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="text-2xl font-bold">Trade Buddy</div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-4">
          <a href="/home" className="text-gray-600 hover:text-gray-900">
            Home
          </a>
          {user && (
            <>
              <a href="/portfolio" className="text-gray-600 hover:text-gray-900">
                Portfolio
              </a>
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
              <a href="/news" className="text-gray-600 hover:text-gray-900">
                News
              </a>
            </>
          )}
        </nav>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <span>{user ? user.name || "User" : "Guest"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user ? "My Account" : "Welcome"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user ? (
              <>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload(); // Simulate logout
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <a href="/login">Login</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/register">Register</a>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}