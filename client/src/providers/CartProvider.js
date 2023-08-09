import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

const CartContext = React.createContext(null);

const CartProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({ isLoggedIn: false, user: null });
  const [hasError, setHasError] = useState(false);
  const [cartItems, setCartItems] = useState({
    products: [],
    services: [],
  });

  useEffect(() => {
    refreshUserInfoAndCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshUserInfoAndCart = async () => {
    try {
      const response = await axios.get("/api/auth/user");
      setUserInfo(response.data);
      if (response.data.isLoggedIn) {
        await refreshCartData();
      }
    } catch (error) {
      console.error(error.response);
      setHasError(true);
    }
  };

  const refreshCartData = async () => {
    await axios
      .get("/api/cart")
      .then((response) => {
        setCartItems(response.data);
      })
      .catch((error) => {
        console.error(error.response);
        setHasError(true);
      });
  };

  return (
    <CartContext.Provider
      value={{
        userInfo,
        hasError,
        cartItems,
        setCartItems,
        refreshUserInfoAndCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCartContext = () => {
  const context = useContext(CartContext);
  return context;
};

export { CartProvider, useCartContext };
