import { type Category, type Image, type Product } from '@prisma/client';
import Drawer from '~/components/Drawer';
import ProductTable from '~/components/ProductTable';

const Layout: React.FC<{
  products: Product[];
  categories: Category[];
  images: Image[];
}> = ({ products, categories, images }) => {
  return (
    <>
      <Drawer>
        <ProductTable
          products={products}
          categories={categories}
          images={images}
        />
      </Drawer>
    </>
  );
};

export default Layout;
