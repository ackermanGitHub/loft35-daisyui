import { type Product, type Image as ProductImage } from '@prisma/client';
import Image from 'next/image';
import { useCart } from '~/context/ShoppingCart';

interface IProps {
  productsData: (Product & {
    primaryImage: ProductImage;
  })[];
}

const ProductsCardScroll: React.FC<IProps> = ({ productsData }) => {
  const { addToCart } = useCart();
  return (
    <div className="flex flex-wrap items-center justify-around">
      {productsData.map((product) => (
        <div key={product.id} className="card w-[45%] glass mt-12">
          <figure className="relative pb-[100%] w-full">
            <Image fill src={product.imageUrl} alt="car!" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              {product.name}
              <span className="badge badge-lg badge-secondary">
                ${product.price}
              </span>
            </h2>
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
                Add to cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsCardScroll;
