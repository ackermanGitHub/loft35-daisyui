import { Category, Image, Product } from '@prisma/client';
import ProductForm from './ProductForm';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';

const ProductTable: React.FC<{
  products: Product[];
  categories: Category[];
  images: Image[];
}> = ({ products, categories, images }) => {
  let { data: productsData, refetch: refetchProducts } =
    api.product.getAll.useQuery();

  const deleteProducts = api.product.deleteMany.useMutation({
    onSuccess: () => {
      void refetchProducts();
    },
  });

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
  }, [productsData]);

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
            <th>Producto</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Disponibles</th>
            <th>Descripción</th>
            <th>Otro</th>
          </tr>
        </thead>
        <tbody>
          {/* rows */}
          {productsData?.map((product) => {
            return (
              <tr key={product.id}>
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
                          src={product.imageUrl}
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
                  {product.categoryName}
                  <br />
                  <span className="badge badge-ghost badge-sm">
                    ID:
                    {product.priority}
                  </span>
                </td>
                <td>{product.categoryName}</td>
                <td>
                  <input type="checkbox" className="toggle" />
                </td>
                <th>
                  <div className="collapse">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                      Mostrar
                    </div>
                    <div className="collapse-content max-w-xs whitespace-pre-wrap">
                      <p>{product.description}</p>
                    </div>
                  </div>
                </th>
                <td></td>
              </tr>
            );
          })}
          <tr>
            <th></th>
            <td>
              <div className="flex items-center space-x-3">
                <ProductForm onUploadSucces={refetchProducts} />
              </div>
            </td>
            <td>
              <div className="flex items-center space-x-3">
                <label
                  onClick={() => {
                    const checkboxes = document.querySelectorAll(
                      '.checkbox-group'
                    ) as NodeListOf<HTMLInputElement>;
                    const checkedProducts = productsData?.filter(
                      (product, index) => {
                        return checkboxes[index]?.checked === true;
                      }
                    );
                    const checkedProductsIds = checkedProducts?.map(
                      (product) => product.id
                    );
                    if (!checkedProductsIds || checkedProductsIds?.length === 0)
                      return;
                    deleteProducts.mutate({
                      productIDs: checkedProductsIds,
                    });
                  }}
                  className="btn text-xs"
                >
                  Borrar
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <th></th>
          </tr>
        </tbody>
        {/* foot */}
        <tfoot>
          <tr>
            <th></th>
            <th>Producto</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Disponibles</th>
            <th>Descripción</th>
            <th>Otro</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ProductTable;
