"use client";
import { cn } from "../../lib/utils";
import {
  Menu,
  X,
  User as UserIcon,
  ShoppingCart,
  ShoppingBag,
  LogOut,
  ChevronDown,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  type NavigateFunction,
} from "react-router-dom";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

interface NavbarProps {
  className?: string;
  isAuthenticated: boolean;
  onLogout: (navigateFunc: NavigateFunction) => void;
  currentUser?: { name?: string } | null;
  itemCount: number;
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
    icon?: React.ElementType;
  }[];
  className?: string;
  onItemClick?: () => void;
  currentPath?: string;
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
  itemCount,
}: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isLogoutConfirmationModalOpen, setIsLogoutConfirmationModalOpen] =
    useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Track viewport width for responsive dropdown sizing
  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);

    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close user dropdown if mobile menu is opened
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsUserDropdownOpen(false);
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu if user dropdown is opened
  useEffect(() => {
    if (isUserDropdownOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isUserDropdownOpen]);

  const userMenuItems = [
    {
      name: "Profil",
      icon: UserIcon,
      link: "/profile",
      description: "Kelola profil Anda",
    },
    {
      name: "Keranjang",
      icon: ShoppingCart,
      link: "/cart",
      description: "Lihat item keranjang",
    },
    {
      name: "Pesanan Saya",
      icon: ShoppingBag,
      link: "/profile/orders",
      description: "Riwayat pesanan",
    },
  ];

  const handleDropdownNavigate = (link: string) => {
    navigate(link);
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLogoutConfirmationModalOpen(true);
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Calculate responsive dropdown width
  const getDropdownWidth = () => {
    if (viewportWidth < 320) return "w-[280px]"; // Very small screens
    if (viewportWidth < 375) return "w-[300px]"; // Small phones
    if (viewportWidth < 768) return "w-[320px]"; // Regular phones
    return "w-80"; // Desktop and tablets
  };

  const getMobileDropdownWidth = () => {
    if (viewportWidth < 320) return "w-[260px]"; // Very small screens
    if (viewportWidth < 375) return "w-[280px]"; // Small phones
    return "w-72"; // Regular phones and up
  };

  return (
    <motion.div
      ref={ref}
      className={cn("fixed top-0 inset-x-0 z-40 w-full", className)}
    >
      {/* Desktop Navbar */}
      <NavBody
        visible={!isMobileMenuOpen}
        className="px-4 sm:px-6 md:px-8 lg:px-10"
      >
        <NavbarLogo />
        <NavItems
          items={[
            { name: "Beranda", link: "/" },
            { name: "Tentang Kami", link: "/about" },
            { name: "Produk", link: "/products" },
          ]}
          currentPath={location.pathname}
        />
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/80 hover:bg-white border border-gray-200/60 hover:border-gray-300/80 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm group min-h-[44px]"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                type="button"
              >
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                  <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900 max-w-16 sm:max-w-24 truncate hidden xs:block">
                  {currentUser?.name || "User"}
                </span>
                <motion.div
                  animate={{ rotate: isUserDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                </motion.div>
              </motion.button>

              {/* Enhanced Desktop User Dropdown */}
              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 top-16 bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden z-50",
                      getDropdownWidth()
                    )}
                    style={{
                      maxWidth: `${Math.min(viewportWidth - 32, 320)}px`,
                      width: `${Math.min(viewportWidth - 32, 320)}px`,
                    }}
                  >
                    {/* Header dengan gradient */}
                    <div className="relative bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100/80">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-500/5" />
                      <div className="relative flex items-center gap-3 sm:gap-4">
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                          <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {currentUser?.name || "Pengguna"}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Selamat datang kembali!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 sm:p-3">
                      {userMenuItems.map((item) => (
                        <motion.button
                          key={item.name}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDropdownNavigate(item.link)}
                          className="w-full text-left px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 transition-all duration-300 flex items-center gap-3 sm:gap-4 group mb-1 min-h-[48px]"
                        >
                          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-100 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                            <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm sm:text-base text-gray-900 group-hover:text-blue-900 flex items-center">
                              <span className="truncate">{item.name}</span>
                              {item.name === "Keranjang" && itemCount > 0 && (
                                <span className="ml-2 bg-blue-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                                  {itemCount}
                                </span>
                              )}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 group-hover:text-blue-600 truncate">
                              {item.description}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-100 p-2 sm:p-3">
                      <motion.button
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full text-left px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 flex items-center gap-3 sm:gap-4 group min-h-[48px]"
                      >
                        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-100 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm sm:text-base text-red-600 group-hover:text-red-700">
                            Logout
                          </div>
                          <div className="text-xs sm:text-sm text-red-400 group-hover:text-red-500">
                            Keluar dari akun
                          </div>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <NavbarButton
              href="/login"
              variant="ghost"
              className="hidden sm:flex"
            >
              Masuk
            </NavbarButton>
          )}
          <NavbarButton
            href="https://wa.me/6285748057838"
            target="_blank"
            rel="noopener noreferrer"
            variant="gradient"
            className="text-xs sm:text-sm px-2.5 sm:px-4"
          >
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Hubungi</span>
            <span className="xs:hidden">Hubungi</span>
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navbar */}
      <MobileNav visible={!isMobileMenuOpen}>
        <MobileNavHeader>
          <NavbarLogo />
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-lg sm:rounded-xl bg-white/80 hover:bg-white border border-gray-200/60 hover:border-gray-300/80 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm min-h-[44px]"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  type="button"
                >
                  <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                    <UserIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  </div>
                  <motion.div
                    animate={{ rotate: isUserDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                  </motion.div>
                </motion.button>

                {/* Enhanced Mobile User Dropdown */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 top-14 bg-white/95 backdrop-blur-2xl rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50",
                        getMobileDropdownWidth()
                      )}
                      style={{
                        maxWidth: `${Math.min(viewportWidth - 32, 288)}px`,
                        width: `${Math.min(viewportWidth - 32, 288)}px`,
                        maxHeight: `${Math.min(
                          window.innerHeight - 120,
                          400
                        )}px`,
                      }}
                    >
                      {/* Mobile Header */}
                      <div className="relative bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50 px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-100/80">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-500/5" />
                        <div className="relative flex items-center gap-2.5 sm:gap-3">
                          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                            <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                              {currentUser?.name || "Pengguna"}
                            </h3>
                            <p className="text-xs text-gray-600">
                              Selamat datang!
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Menu Items */}
                      <div className="p-1.5 sm:p-2 max-h-64 overflow-y-auto">
                        {userMenuItems.map((item) => (
                          <motion.button
                            key={item.name}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleDropdownNavigate(item.link)}
                            className="w-full text-left px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 transition-all duration-300 flex items-center gap-2.5 sm:gap-3 group mb-1 min-h-[44px]"
                          >
                            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                              <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 group-hover:text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs sm:text-sm text-gray-900 group-hover:text-blue-900 flex items-center">
                                <span className="truncate">{item.name}</span>
                                {item.name === "Keranjang" && itemCount > 0 && (
                                  <span className="ml-2 bg-blue-600 text-white text-xs font-semibold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center flex-shrink-0">
                                    {itemCount}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 group-hover:text-blue-600 truncate">
                                {item.description}
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      {/* Mobile Logout */}
                      <div className="border-t border-gray-100 p-1.5 sm:p-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleLogout}
                          className="w-full text-left px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 flex items-center gap-2.5 sm:gap-3 group min-h-[44px]"
                        >
                          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs sm:text-sm text-red-600 group-hover:text-red-700">
                              Logout
                            </div>
                            <div className="text-xs text-red-400 group-hover:text-red-500">
                              Keluar dari akun
                            </div>
                          </div>
                        </motion.button>
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
          <div className="max-h-[60vh] overflow-y-auto">
            {[
              { name: "Beranda", link: "/" },
              { name: "Tentang Kami", link: "/about" },
              { name: "Produk", link: "/products" },
            ].map((item, index) => {
              const isActive = (link: string) => {
                if (link === "/" && location.pathname === "/") return true;
                if (link !== "/" && location.pathname.startsWith(link))
                  return true;
                return false;
              };
              const active = isActive(item.link);
              return (
                <Link
                  key={index}
                  to={item.link}
                  className={cn(
                    "relative w-full px-4 sm:px-5 py-3 sm:py-4 text-gray-700 font-medium text-center transition-all duration-300 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 min-h-[48px] flex items-center justify-center",
                    active ? "text-white" : "text-gray-700"
                  )}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="selected-mobile-item"
                      className="absolute inset-0 h-full w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-blue-600 shadow-lg"
                    />
                  )}
                  <span className="relative text-sm sm:text-base">
                    {item.name}
                  </span>
                </Link>
              );
            })}

            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3 sm:my-4" />

            {!isAuthenticated && (
              <NavbarButton
                href="/login"
                className="w-full mt-2 min-h-[48px]"
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </NavbarButton>
            )}
            <NavbarButton
              href="https://wa.me/6281358092166"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-2 min-h-[48px] text-sm sm:text-base"
              variant="gradient"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Phone className="w-4 h-4 mr-2" />
              Hubungi Kami
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
      <LogoutConfirmationModal
        isOpen={isLogoutConfirmationModalOpen}
        onClose={() => setIsLogoutConfirmationModalOpen(false)}
        onConfirm={() => {
          onLogout(navigate);
          setIsLogoutConfirmationModalOpen(false);
        }}
      />
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
        width: visible ? "90%" : "75%",
        y: visible ? 12 : 0,
        borderRadius: "1.25rem",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start px-4 py-2.5 sm:px-6 sm:py-3 lg:flex border border-white/20",
        className
      )}
      style={{
        maxWidth: "calc(100vw - 2rem)",
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-blue-500/5 to-pink-500/5 opacity-50" />
      {children}
    </motion.div>
  );
};

export const NavItems = ({
  items,
  className,
  onItemClick,
  currentPath,
}: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const isActive = (link: string) => {
    if (link === "/" && currentPath === "/") return true;
    if (link !== "/" && currentPath?.startsWith(link)) return true;
    return false;
  };

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 sm:gap-2 md:gap-3",
        className
      )}
    >
      {items.map((item, idx) => {
        const active = isActive(item.link);
        return (
          <Link
            onMouseEnter={() => setHovered(idx)}
            onClick={onItemClick}
            className={cn(
              "relative px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 transition-all duration-300 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base min-h-[40px] flex items-center",
              active
                ? "text-white"
                : hovered === idx
                ? "text-white"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/50"
            )}
            key={`link-${idx}`}
            to={item.link}
          >
            {(hovered === idx || active) && (
              <motion.div
                layoutId="hovered"
                className="absolute inset-0 h-full w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-blue-600 shadow-lg"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-20 truncate">{item.name}</span>
          </Link>
        );
      })}
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
        width: visible ? "95%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: "1.25rem",
        y: visible ? 12 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-1rem)] flex-col items-center justify-between px-0 py-2.5 sm:py-3 lg:hidden border border-white/20",
        className
      )}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-blue-500/5 to-pink-500/5 opacity-50" />
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
        "flex w-full flex-row items-center justify-between px-3 sm:px-4 relative z-10",
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
            "absolute inset-x-0 top-full z-50 flex w-full flex-col items-start justify-start gap-1 sm:gap-2 overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl px-3 sm:px-4 py-4 sm:py-6 shadow-2xl border border-white/20 mt-2",
            className
          )}
          style={{
            maxHeight: "calc(100vh - 120px)",
          }}
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
      className="relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-200/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
            <X className="text-gray-700" size={18} />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Menu className="text-gray-700" size={18} />
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
      className="relative z-20 mr-2 sm:mr-4 flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-2 text-base sm:text-lg font-bold group"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center space-x-1.5 sm:space-x-2"
      >
        <div className="h-10 w-10 flex items-center overflow-visible">
          <img
            src="/logo.png"
            alt="TriJaya Agung"
            className="h-10 w-10 object-contain scale-125 origin-left"
          />
        </div>
        <span className="hidden md:block bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent font-bold truncate max-w-[120px] sm:max-w-none">
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
    "px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm relative cursor-pointer transition-all duration-300 inline-flex items-center justify-center min-h-[40px] sm:min-h-[44px]";

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
