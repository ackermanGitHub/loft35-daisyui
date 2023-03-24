import {
  type Category,
  type Image as ProductImage,
  type Product,
} from '@prisma/client';
import ProductForm from './ProductForm';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import ModalConfirm from './ModalConfirm';
import Image from 'next/image';

const ProductTable: React.FC<{
  products: Product[];
  categories: Category[];
  images: ProductImage[];
}> = ({ products, categories, images }) => {
  console.log(products);
  console.log(categories);
  console.log(images);

  const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] = useState(false);

  const {
    data: productsData,
    refetch: refetchProducts,
    isLoading: isProductsLoading,
  } = api.product.getAll.useQuery();

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
      if (productsData && productsData[index] && !isProductsLoading) {
        toggle.checked = productsData[index]?.active || toggle.checked;
      }
    });

    selectCheckbox.addEventListener('click', () => {
      checkboxes.forEach((checkBox) => {
        checkBox.checked = selectCheckbox.checked;
      });
      setIsAnyCheckboxSelected(selectCheckbox.checked);
    });

    checkboxes.forEach((checkBox) => {
      checkBox.addEventListener('change', () => {
        setIsAnyCheckboxSelected(
          Array.from(checkboxes).some((checkbox) => checkbox.checked)
        );
      });
    });
  }, [isProductsLoading, productsData]);

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
            {/* <th>Descripción</th> */}
            <th>Image</th>
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
                      className="checkbox select-checkbox-group"
                    />
                  </label>
                </th>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <Image
                          src={product.primaryImage.url}
                          alt="Avatar Tailwind CSS Component"
                          width={48}
                          height={48}
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
                    onChange={() => {
                      toggleActive.mutate({
                        productID: product.id,
                        active: !product.active,
                      });
                    }}
                  />
                </td>
                {/* <th>
                  <div className="collapse">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                      Mostrar
                    </div>
                    <div className="collapse-content whitespace-pre-wrap">
                      <p>{product.description}</p>
                    </div>
                  </div>
                </th> */}
                <th>
                  {Math.round(product.primaryImage.sizeMb)}
                  <span className="text-sm">kb</span>
                </th>
              </tr>
            );
          })}
          <tr>
            <th></th>
            <td className="flex flex-row justify-around gap-2">
              <div className="flex items-center space-x-3">
                <ProductForm
                  onUploadSucces={() => {
                    void refetchProducts();
                  }}
                />
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
                isDisabled={
                  !isAnyCheckboxSelected || productsData?.length !== 0
                }
                title="Eliminando!"
                description="Estás segura que deseas eliminar estos productos?"
              >
                <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 6.77273H9.2M19 6.77273H14.8M9.2 6.77273V5.5C9.2 4.94772 9.64772 4.5 10.2 4.5H13.8C14.3523 4.5 14.8 4.94772 14.8 5.5V6.77273M9.2 6.77273H14.8M6.4 8.59091V15.8636C6.4 17.5778 6.4 18.4349 6.94673 18.9675C7.49347 19.5 8.37342 19.5 10.1333 19.5H13.8667C15.6266 19.5 16.5065 19.5 17.0533 18.9675C17.6 18.4349 17.6 17.5778 17.6 15.8636V8.59091M9.2 10.4091V15.8636M12 10.4091V15.8636M14.8 10.4091V15.8636"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </ModalConfirm>
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
            {/* <th>Descripción</th> */}
            <th>Image</th>
          </tr>
        </tfoot>
      </table>
      <div className="chat gap-4 chat-end absolute bottom-20 right-8 transition-opacity duration-700  opacity-0">
        <div className="chat-bubble chat-bubble-warning">
          To be on the Council at your age.
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
