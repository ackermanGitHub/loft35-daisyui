import Image from 'next/image';
import { useCart } from '~/components/cart/ShoppingCart';
import { api } from '~/utils/api';

const ProductsCardScroll: React.FC = () => {
  const { addToCart } = useCart();

  const { data: productsData } = api.product.getAll.useQuery();

  return (
    <div className="flex flex-wrap items-center justify-around">
      {productsData &&
        productsData.map((product) => (
          <div
            key={product.id}
            className="card card-compact w-[45%] glass mt-12"
          >
            <figure className="relative pb-[100%] w-full">
              <Image fill src={product.imageUrl} alt="car!" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{product.name}</h2>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    addToCart({
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      quantity: 1,
                    });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={24}
                    width={24}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductsCardScroll;
