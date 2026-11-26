import { createContext, useContext } from 'react';

export const NavbarContext = createContext({
  isNavbarVisible: true,
  setIsNavbarVisible: () => {},
});

export const useNavbar = () => useContext(NavbarContext);
