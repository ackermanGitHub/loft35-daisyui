import Image from 'next/image';
import { createContext, useContext, useState, useEffect } from 'react';
import SettingsOptions from '~/components/settings/Settings';

import BuyingProcess from '~/components/cart/BuyingProcess';
import { useCookies } from 'react-cookie';

// TODO store cart items on cookies
export interface CartItem {
  productId: number;
  imageURL: string;
  blurImageUrl: string;
  productStock: number;
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
  const [cookies, setCookie] = useCookies(['cart']);


  useEffect(() => {
    setCookie("cart", cart)
    console.log("added to cookies", cart)
  }, [cart, setCookie])

  useEffect(() => {
    setCart(cookies.cart)
    console.log("added from cookies", cart)
  }, [])

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
    } else {
      setCart({
        items: [...cart.items, newItem],
        total: cart.total + newItem.price,
      });
    }
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
      <input type="checkbox" id="cart-modal" className="modal-toggle" />
      <label
        htmlFor="cart-modal"
        className="modal max-[768px]:modal-bottom cursor-pointer"
      >
        <label className="modal-box relative" htmlFor="">
          <label
            htmlFor="cart-modal"
            className="absolute top-4 right-4 btn btn-ghost cursor-pointer rounded-full z-20">
            <svg fill="none" viewBox="0 0 24 24" width={18} height={18} stroke='currentColor'>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </label>
          <div className="flex flex-col gap-4 justify-between items-center">
            <div className="card-header gap-2 flex">
              <div className="stack">
                {cart.items.map((item) => (
                  <figure
                    key={item.productId}
                    className="relative rounded-xl overflow-hidden pb-[100%] w-16"
                  >
                    <Image
                      src={item.imageURL}
                      blurDataURL={item.blurImageUrl}
                      alt={item.name}
                      placeholder="blur"
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 60vw,
                      (max-width: 1200px) 40vw,
                      33vw"
                      quality={60}
                    />
                  </figure>
                ))}
              </div>
              <div className="flex flex-col">
                <h1 className="card-title font-bold text-lg">
                  {cart.items.reduce((a, b) => a + b.quantity, 0)} Productos
                </h1>
                <h2 className="card-title text-info">Total: ${cart.total}</h2>
              </div>
            </div>
            {cart.items.length === 0 ? (
              <h1 className="card-title font-bold text-lg">
                Tu carrito esta vacio 😥
              </h1>
            ) : (
              <div className='w-full max-h-[40vh] overflow-scroll bg-base-100'>
                <table className='table table-compact table-zebra w-full'>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((item) => (
                      <tr key={item.productId}>
                        <th>
                          <Image
                            src={item.imageURL}
                            alt={item.name}
                            placeholder="blur"
                            blurDataURL={item.blurImageUrl}
                            width={64}
                            height={64}
                          />
                        </th>
                        <th>{item.price}</th>
                        <th>
                          <select onChange={(e) => {
                            const newQuantity = Number(e.target.value);

                            setCart({
                              total: cart.total + (newQuantity - item.quantity) * item.price,
                              items: cart.items.map((product) =>
                                product.productId === item.productId
                                  ? { ...product, quantity: newQuantity }
                                  : product
                              ),
                            });
                          }} value={item.quantity} className="select">
                            {Array(item.productStock)
                              .fill(0)
                              .map((_, index) => (
                                <option value={index + 1} key={index + 1}>
                                  {index + 1}
                                </option>
                              ))}
                          </select>
                        </th>
                        <th>{item.quantity * item.price}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="modal-action">
            <label onClick={() => {
              console.log("cookies", cookies.cart)
              console.log("cart", cart)
            }} className="btn btn-primary">
              Cookies/Cart
            </label>
            <label id='open-buy-modal' htmlFor="buy-modal" className={`btn btn-primary ${cart.items.length === 0 ? 'btn-disabled' : ''}`}>
              Comprar
            </label>
            <label htmlFor="cart-modal" className="btn btn-primary">
              Close
            </label>
          </div>
        </label>
      </label>
      <BuyingProcess />
      <SettingsOptions />

      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
