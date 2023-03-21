import { Category, Image, Product } from '@prisma/client';
import ProductForm from './ProductForm';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';

const ProductTable: React.FC<{
  products: Product[];
  categories: Category[];
  images: Image[];
}> = ({ products, categories, images }) => {
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

  let { data: productData, refetch: refetchProducts } =
    api.product.getAll.useQuery();

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
          </tr>
        </thead>
        <tbody>
          {/* rows */}
          {productData?.map((product) => {
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
                <ProductForm onUploadSucces={refetchProducts} />
              </div>
            </td>
            <td>
              <div className="flex items-center space-x-3">
                <label
                  onClick={() => {
                    console.log('');
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
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ProductTable;
