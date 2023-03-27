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
  const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] = useState(false);
  const [editInputProperties, setEditInputProperties] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    active: false,
    value: '',
    productID: -1,
  });

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

  const updateProduct = api.updateProduct.updateName.useMutation({
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
    <div className="relative overflow-x-auto w-full">
      {editInputProperties?.active && (
        <div className="relative">
          <input
            onChange={(e) => {
              setEditInputProperties({
                ...editInputProperties,
                value: e.target.value,
              });
            }}
            style={{
              left: editInputProperties?.left,
              top: editInputProperties?.top,
              height: editInputProperties?.height,
              width: editInputProperties?.width,
              display: `${editInputProperties?.active ? 'block' : 'none'}`,
            }}
            defaultValue={editInputProperties.value}
            className="absolute input input-primary z-20"
          />
          <h2
            style={{
              left: editInputProperties?.left + editInputProperties?.width - 35,
              top:
                editInputProperties?.top + editInputProperties?.height / 2 - 12,
              display: `${editInputProperties?.active ? 'block' : 'none'}`,
            }}
            onClick={() => {
              setEditInputProperties({ ...editInputProperties, active: false });
            }}
            className="absolute z-30"
          >
            ❌
          </h2>
        </div>
      )}
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
          {productsData
            ?.sort((a, b) => a.priority - b.priority)
            .map((product) => {
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
                        <div
                          onClick={() => {
                            console.log(product);
                          }}
                          className="mask mask-squircle w-12 h-12"
                        >
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
                  <th>
                    <div className="flex justify-between items-center">
                      <p>{product.name}</p>
                      {editInputProperties.active &&
                        editInputProperties.productID === product.id && (
                          <div
                            onClick={() => {
                              console.log(product);

                              console.log('onClick-UpdateName', {
                                productID: product.id,
                                editInputProperties,
                              }),
                                setEditInputProperties({
                                  ...editInputProperties,
                                  active: false,
                                });
                              if (product.name === editInputProperties.value)
                                return;
                              updateProduct.mutate({
                                productID: product.id,
                                newName: editInputProperties.value,
                              });
                              product.name = editInputProperties.value;
                            }}
                            className="fixed inset-0 w-[100vw] h-[100vh] opacity-30 stroke-slate-600"
                          ></div>
                        )}
                      <span
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          const target = event.currentTarget as HTMLSpanElement;
                          const parent =
                            target.parentElement as HTMLTableCellElement;
                          const grandParent =
                            parent.parentElement as HTMLTableCellElement;

                          const position = {
                            x: grandParent?.offsetLeft,
                            y: grandParent?.offsetTop,
                          };
                          const size = {
                            width: grandParent?.offsetWidth,
                            height: grandParent?.offsetHeight,
                          };

                          setEditInputProperties({
                            left: position.x,
                            top: position.y,
                            height: size.height,
                            width: size.width,
                            value: product.name,
                            active: true,
                            productID: product.id,
                          });
                        }}
                        className="label-text relative"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          stroke="currentColor"
                          width={20}
                          height={20}
                        >
                          <path d="M14.7881 2.5752L15.3008 2.04199C15.5605 1.76855 15.5742 1.39941 15.3213 1.13965L15.1436 0.955078C14.9111 0.722656 14.5283 0.763672 14.2754 1.00977L13.749 1.5293L14.7881 2.5752ZM6.68066 9.87598L8.0752 9.28809L14.2891 3.06738L13.25 2.03516L7.03613 8.25586L6.4209 9.60254C6.35254 9.75977 6.52344 9.9375 6.68066 9.87598ZM4.09668 14.4355H12.0674C13.373 14.4355 14.1387 13.6768 14.1387 12.2207V4.99512L12.7988 6.33496V12.1045C12.7988 12.7676 12.4434 13.1025 11.9854 13.1025H4.17871C3.54297 13.1025 3.19434 12.7676 3.19434 12.1045V4.49609C3.19434 3.83301 3.54297 3.49805 4.17871 3.49805H10.0234L11.3633 2.1582H4.09668C2.62695 2.1582 1.85449 2.91699 1.85449 4.37988V12.2207C1.85449 13.6836 2.62695 14.4355 4.09668 14.4355Z"></path>
                        </svg>
                      </span>
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
                  !isAnyCheckboxSelected || productsData?.length === 0
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
            <th>Descripción</th>
            <th>Image</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ProductTable;
