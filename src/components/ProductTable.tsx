import { Category, Image, Product } from '@prisma/client';
import ProductForm from './ProductForm';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import ModalConfirm from './ModalConfirm';

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

  const toggleActive = api.product.setActive.useMutation({
    onSuccess: () => {
      void refetchProducts();
    },
  });

  useEffect(() => {
    const selectCheckbox = document.getElementById(
      'select-all-checkbox'
    ) as HTMLInputElement;
    const checkboxes = document.querySelectorAll(
      '.select-checkbox-group'
    ) as NodeListOf<HTMLInputElement>;

    const togglesActives = document.querySelectorAll(
      '.toggle-active'
    ) as NodeListOf<HTMLInputElement>;

    togglesActives.forEach((toggle, index) => {
      if (productsData && productsData[index]) {
        toggle.checked = productsData[index]?.active || false;
      }
    });
    selectCheckbox.addEventListener('click', () => {
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i]!.checked = selectCheckbox.checked;
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
                <input
                  id="select-all-checkbox"
                  type="checkbox"
                  className="checkbox"
                />
              </label>
            </th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Disponibles</th>
            <th>Descripción</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {/* rows */}
          {productsData?.map((product, index) => {
            return (
              <tr key={product.id}>
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox select-checkbox-group"
                    />
                  </label>
                </th>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={product.primaryImage.url}
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="font-bold">{product.name}</div>
                      <div className="flex justify-around items-center flex-row">
                        <div className="text-sm opacity-50">
                          ${product.price}
                        </div>
                        <div
                          className={`badge badge-sm text-sm badge-${
                            product.active ? 'success' : 'warning'
                          } gap-2`}
                        >
                          {product.active ? 'active' : 'disabled'}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>{product.categoryName}</td>
                <td>
                  <input
                    type="checkbox"
                    className="toggle toggle-active"
                    onChange={(e) => {
                      toggleActive.mutate({
                        productID: product.id,
                        active: !product.active,
                      });
                    }}
                  />
                </td>
                <th>
                  <div className="collapse">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                      Mostrar
                    </div>
                    <div className="collapse-content whitespace-pre-wrap">
                      <p>{product.description}</p>
                    </div>
                  </div>
                </th>
                <th>
                  {Math.round(product.primaryImage.sizeMb)}
                  <span className="text-sm">kb</span>
                </th>
              </tr>
            );
          })}
          <tr>
            <th></th>
            <td className="flex flex-row justify-around">
              <div className="flex items-center space-x-3">
                <ProductForm onUploadSucces={refetchProducts} />
              </div>
              <ModalConfirm
                onOkFn={() => {
                  // Getting checkboxes
                  const checkboxes = document.querySelectorAll(
                    '.select-checkbox-group'
                  ) as NodeListOf<HTMLInputElement>;
                  // Filter selected products ids
                  const checkedProductsIds = productsData
                    ?.filter((product, index) => {
                      return checkboxes[index]?.checked === true;
                    })
                    .map((product) => product.id);

                  if (!checkedProductsIds || checkedProductsIds?.length === 0)
                    return;
                  deleteProducts.mutate({
                    productIDs: checkedProductsIds,
                  });
                }}
                okBtnText="Eliminar"
                openModalText="Eliminar"
                title="Eliminando!"
                description="Estás segura que deseas eliminar estos productos?"
              />
            </td>
            <td>
              <div className="flex items-center space-x-3">
                {/* <label
                  htmlFor="my-modal-6"
                  onClick={() => {
                    // Getting checkboxes
                    const checkboxes = document.querySelectorAll(
                      '.select-checkbox-group'
                    ) as NodeListOf<HTMLInputElement>;
                    // Filter selected products ids
                    const checkedProductsIds = productsData
                      ?.filter((product, index) => {
                        return checkboxes[index]?.checked === true;
                      })
                      .map((product) => product.id);

                    if (!checkedProductsIds || checkedProductsIds?.length === 0)
                      return;
                    deleteProducts.mutate({
                      productIDs: checkedProductsIds,
                    });
                  }}
                  className="btn text-xs"
                >
                  Borrar
                </label> */}
              </div>
            </td>
          </tr>
        </tbody>
        {/* foot */}
        <tfoot>
          <tr>
            <th></th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Disponibles</th>
            <th>Descripción</th>
            <th>Image</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ProductTable;
