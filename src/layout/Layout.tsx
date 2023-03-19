import { Category, Product } from '@prisma/client';
import Drawer from '~/components/Drawer';
import ProductTable from '~/components/ProductTable';

const Layout: React.FC<{ products: Product[]; categories: Category[] }> = ({
  products,
  categories,
}) => {
  return (
    <>
      <Drawer>
        <ProductTable products={products} categories={categories} />
      </Drawer>
    </>
  );
};

export default Layout;
