import { Category, Product } from '@prisma/client';
import ProductForm from './ProductForm';
import { useEffect } from 'react';

const ProductTable: React.FC<{
  products: Product[];
  categories: Category[];
}> = ({ products, categories }) => {
  useEffect(() => {
    const selectAll = document.getElementById('select-all') as HTMLInputElement;
    const checkboxes = document.querySelectorAll(
      '.checkbox-group'
    ) as NodeListOf<HTMLInputElement>;

    selectAll.addEventListener('click', () => {
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i]!.checked = selectAll.checked;
      }
    });
  }, []);

  return (
    <div className="overflow-x-auto w-full">
      <table className="table w-full">
        <thead>
          <tr>
            <th>
              <label>
                <input id="select-all" type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Disponibles</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {/* rows */}
          {products.map((product) => {
            return (
              <tr>
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-group"
                    />
                  </label>
                </th>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={product.image}
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{product.name}</div>
                      <div className="text-sm opacity-50">${product.price}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {
                    categories.find(
                      (category) => category.id === product.categoryId
                    )?.name
                  }
                  <br />
                  <span className="badge badge-ghost badge-sm">
                    ID:
                    {
                      categories.find(
                        (category) => category.id === product.categoryId
                      )?.id
                    }
                  </span>
                </td>
                <td>{product.stock}</td>
                <th>
                  <div className="collapse">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                      Mostrar
                    </div>
                    <div className="collapse-content">
                      <p>{product.description}</p>
                    </div>
                  </div>
                </th>
              </tr>
            );
          })}
          <tr>
            <th></th>
            <td>
              <div className="flex items-center space-x-3">
                <ProductForm />
              </div>
            </td>
          </tr>
        </tbody>
        {/* foot */}
        <tfoot>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Disponibles</th>
            <th>Descripción</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ProductTable;
