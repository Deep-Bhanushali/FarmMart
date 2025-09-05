"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, LogIn, Menu, X, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FarmMarket</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 font-semibold hover:text-primary-600">
              Home
            </Link>
            {isMounted && user?.role === "customer" && (
              <Link href="/products" className="text-gray-700 font-semibold hover:text-primary-600">
                Products
              </Link>
            )}
            {isMounted && user?.role === "farmer" && (
              <Link href="/dashboard" className="text-gray-700 font-semibold hover:text-primary-600">
                Dashboard
              </Link>
            )}
            {isMounted && user && (
              <Link href="/orders" className="text-gray-700 font-semibold hover:text-primary-600">
                Orders
              </Link>
            )}
          </nav>
          
          <div className="flex items-center space-x-2">
            {/* Desktop-only actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isMounted ? (
                <>
                  {user && (
                    <>
                      <Link href="/cart" className="relative p-2 text-gray-700 rounded-full hover:bg-gray-100 hover:text-primary-600">
                        <ShoppingCart className="h-6 w-6" />
                        {cartItemCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartItemCount}
                          </span>
                        )}
                      </Link>
                      <Link href="/wishlist" className="relative text-gray-700 rounded-full hover:bg-gray-100 hover:text-primary-600 p-2">
                        <Heart className="h-6 w-6" />
                      </Link>
                    </>
                  )}
                  {/* The NotificationBell is moved here for desktop */}
                  {user && <NotificationBell />}
                  {user ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-700">{user.name}</span>
                      </div>
                      <button onClick={logout} className="text-gray-700 hover:text-primary-600">
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <Link href="/login" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                        <LogIn className="h-5 w-5" />
                        <span>Login</span>
                      </Link>
                      <Link href="/register" className="btn-primary">
                        Sign Up
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              )}
            </div>

            {/* Mobile-only actions */}
            <div className="flex items-center md:hidden">
                {isMounted && user && <NotificationBell />}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-700 hover:text-primary-600">
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>
          </div>
          {/* --- END: CLEANED UP ACTIONS BLOCK --- */}
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {isMounted && (
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
                {user?.role === "customer" && (
                  <Link href="/products" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>Products</Link>
                )}
                {user?.role === "farmer" && (
                  <Link href="/dashboard" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                )}
                {user && (
                  <Link href="/orders" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>Orders</Link>
                )}
                {user && (
                  <Link href="/wishlist" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </Link>
                )}
                <Link href="/cart" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart ({cartItemCount})</span>
                </Link>
                {user ? (
                  <div className="pt-4 mt-2 border-t flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 text-gray-700"><User className="h-5 w-5" /><span>{user.name}</span></div>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-gray-700 hover:text-primary-600">Logout</button>
                  </div>
                ) : (
                  <div className="pt-4 mt-2 border-t flex flex-col space-y-2">
                    <Link href="/login" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}><LogIn className="h-5 w-5" /><span>Login</span></Link>
                    <Link href="/register" className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                  </div>
                )}
              </nav>
            )}
          </div>
        )}
      </div>
    </header>
  );
}