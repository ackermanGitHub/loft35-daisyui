import { createContext, useContext, useState } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CartContext {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
}

const CartContext = createContext<CartContext | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
  });

  const addToCart = (newItem: CartItem) => {
    const existItem = cart.items.find(
      (item) => item.productId === newItem.productId
    );

    if (existItem) {
      setCart({
        items: cart.items.map((item) =>
          item.productId === existItem.productId
            ? { ...existItem, quantity: existItem.quantity + newItem.quantity }
            : item
        ),
        total: cart.total + newItem.price,
      });
      return;
    }

    setCart({
      items: [...cart.items, newItem],
      total: cart.total + newItem.price,
    });
  };

  const removeFromCart = (productId: number) => {
    const removedProduct = cart.items.find(
      (item) => item.productId === productId
    );

    if (!removedProduct) {
      throw new Error('Product not found');
    }

    setCart({
      items: cart.items.filter(
        (item) => item.productId !== removedProduct.productId
      ),
      total: cart.total - removedProduct.price,
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
