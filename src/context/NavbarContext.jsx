import { useState, useMemo } from 'react';
import { NavbarContext } from './useNavbar';

/**
 * Provides shared visibility state of the fixed top Navbar so sticky
 * page toolbars (such as the Site Map tabs bar) can stay lockstep aligned.
 */
export const NavbarProvider = ({ children }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const value = useMemo(
    () => ({ isNavbarVisible, setIsNavbarVisible }),
    [isNavbarVisible]
  );

  return <NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>;
};
