import { type Product, type Image as ProductImage } from '@prisma/client';
import Image from 'next/image';

interface IProps {
  productsData: (Product & {
    primaryImage: ProductImage;
  })[];
}

const ProductsCardScroll: React.FC<IProps> = ({ productsData }) => {
  return (
    <div className="flex items-center flex-col justify-center">
      {productsData.map((product) => (
        <div key={product.id} className="card w-96 glass mt-12">
          <figure className="relative h-96 w-96">
            <Image fill src={product.imageUrl} alt="car!" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Life hack</h2>
            <p>How to park your car at your garage?</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Learn now!</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsCardScroll;
