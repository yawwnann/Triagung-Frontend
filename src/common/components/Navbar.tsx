"use client";
import { cn } from "../../lib/utils";
import { Menu, X, User as UserIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";

interface NavbarProps {
  className?: string;
  isAuthenticated: boolean;
  onLogout: (navigateFunc: NavigateFunction) => void;
  currentUser?: { name?: string } | null;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
}

export const Navbar = ({
  className,
  isAuthenticated,
  onLogout,
  currentUser,
}: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedMobileItem, setSelectedMobileItem] = useState<number>(0);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 z-40 w-full", className)}
    >
      {/* Desktop Navbar */}
      <NavBody visible={true} className="px-10">
        <NavbarLogo />
        <NavItems
          items={[
            { name: "Beranda", link: "/" },
            { name: "Tentang Kami", link: "/about" },
            { name: "Produk", link: "/products" },
          ]}
        />
        <div className="ml-auto flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group border border-blue-100/50 shadow-lg hover:shadow-xl"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                type="button"
              >
                <UserIcon className="w-5 h-5 text-blue-600" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              {/* User Dropdown */}
              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-14 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 py-2 z-50"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 via-blue-500/5 to-pink-500/5" />
                    <div className="relative z-10">
                      {currentUser?.name && (
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {currentUser.name}
                          </p>
                          <p className="text-xs text-gray-500">Profile</p>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors duration-200 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4" />
                        Lihat Profile
                      </button>
                      <button
                        onClick={() => {
                          onLogout(navigate);
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50/80 transition-colors duration-200 flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <NavbarButton href="/login" variant="ghost">
              Login
            </NavbarButton>
          )}
          <NavbarButton href="#" variant="gradient">
            <Sparkles className="w-4 h-4 mr-2" />
            Hubungi Kami
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navbar */}
      <MobileNav visible={true}>
        <MobileNavHeader>
          <NavbarLogo />
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group border border-blue-100/50 shadow-lg hover:shadow-xl"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  type="button"
                >
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>

                {/* Mobile User Dropdown */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 w-44 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 py-2 z-50"
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 via-blue-500/5 to-pink-500/5" />
                      <div className="relative z-10">
                        {currentUser?.name && (
                          <div className="px-3 py-2 border-b border-gray-100">
                            <p className="text-xs font-medium text-gray-900">
                              {currentUser.name}
                            </p>
                            <p className="text-xs text-gray-500">Profile</p>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setIsUserDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors duration-200 flex items-center gap-2"
                        >
                          <UserIcon className="w-3 h-3" />
                          Lihat Profile
                        </button>
                        <button
                          onClick={() => {
                            onLogout(navigate);
                            setIsUserDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50/80 transition-colors duration-200 flex items-center gap-2"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileMenuOpen}>
          {[
            { name: "Beranda", link: "/" },
            { name: "Tentang Kami", link: "/about" },
            { name: "Produk", link: "/products" },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`relative w-full px-5 py-4 text-gray-700 font-medium text-center transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 ${
                selectedMobileItem === index ? "text-white" : "text-gray-700"
              }`}
              onClick={() => {
                setSelectedMobileItem(index);
              }}
            >
              {selectedMobileItem === index && (
                <motion.div
                  layoutId="selected-mobile-item"
                  className="absolute inset-0 h-full w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-600 shadow-lg"
                />
              )}
              <span className="relative">{item.name}</span>
            </Link>
          ))}

          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2" />

          {!isAuthenticated && (
            <NavbarButton
              href="/login"
              className="w-full mt-2"
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </NavbarButton>
          )}
          <NavbarButton
            href="#"
            className="w-full mt-2"
            variant="gradient"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Hubungi Kami
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(20px)" : "blur(10px)",
        background: visible
          ? "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%)",
        boxShadow: visible
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.05) inset"
          : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        width: visible ? "85%" : "70%",
        y: visible ? 15 : 0,
        borderRadius: "1.5rem",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start px-6 py-3 lg:flex border border-white/20",
        className
      )}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/5 via-blue-500/5 to-pink-500/5 opacity-50" />
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-1 text-sm font-medium transition duration-200 lg:flex",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className={cn(
            "relative px-5 py-2.5 transition-all duration-300 rounded-xl font-medium",
            hovered === idx
              ? "text-white"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/50"
          )}
          key={`link-${idx}`}
          to={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-600 shadow-lg"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </Link>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(20px)" : "blur(10px)",
        background: visible
          ? "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)",
        boxShadow: visible
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        width: visible ? "92%" : "100%",
        paddingRight: visible ? "16px" : "0px",
        paddingLeft: visible ? "16px" : "0px",
        borderRadius: "1.5rem",
        y: visible ? 15 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between px-0 py-3 lg:hidden border border-white/20",
        className
      )}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/5 via-blue-500/5 to-pink-500/5 opacity-50" />
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between px-4 relative z-10",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "absolute inset-x-0 top-full z-50 flex w-full flex-col items-start justify-start gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl px-4 py-6 shadow-2xl border border-white/20 mt-2",
            className
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-blue-500/5 to-pink-500/5" />
          <div className="relative z-10 w-full space-y-1">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className="relative p-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-200/50"
      onClick={onClick}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <X className="text-gray-700" size={20} />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Menu className="text-gray-700" size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export const NavbarLogo = () => {
  return (
    <Link
      to="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-3 py-2 text-lg font-bold group"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center space-x-2"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">T</span>
        </div>
        <span className="bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent font-bold">
          TriJaya Agung
        </span>
      </motion.div>
    </Link>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "gradient";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-4 py-2.5 rounded-xl font-medium text-sm relative cursor-pointer transition-all duration-300 inline-flex items-center justify-center";

  const variantStyles = {
    primary:
      "bg-white text-gray-700 shadow-lg hover:shadow-xl border border-gray-200/50 hover:bg-gray-50 hover:-translate-y-0.5",
    secondary:
      "bg-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100/50",
    ghost:
      "bg-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100/70 border border-transparent hover:border-gray-200/50",
    gradient:
      "bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-700 hover:-translate-y-0.5 border border-blue-500/20",
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Tag
        href={href || undefined}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {children}
      </Tag>
    </motion.div>
  );
};
