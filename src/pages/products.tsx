import Head from 'next/head';
import Layout from '~/layout/Layout';
import { type Product, type Image as ProductImage } from '@prisma/client';
import ProductForm from '~/components/ProductForm';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import ModalConfirm from '~/components/ModalConfirm';
import ProductTableRow from '~/components/ProductTableRow';

const Home = () => {
  const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] = useState(false);
  const [orderedOptions, setOrderedOptions] = useState<{
    column: string;
    reverse: boolean;
  }>();
  const [products, setProducts] = useState<
    (Product & {
      primaryImage: ProductImage;
    })[]
  >();
  const [editInputProperties, setEditInputProperties] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    active: false,
    value: '',
    productID: -1,
    type: '',
    column: '',
  });

  const {
    data: productsData,
    refetch: refetchProducts,
    isLoading: isProductsLoading,
  } = api.product.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      if (orderedOptions) {
        switch (orderedOptions.column) {
          case 'name':
            setProducts(data.sort((a, b) => a.name.localeCompare(b.name)));
            break;
          case 'category':
            setProducts(
              data.sort((a, b) => a.categoryName.localeCompare(b.categoryName))
            );
            break;
          case 'price':
            setProducts(data.sort((a, b) => a.price - b.price));
            break;
          default:
            if (orderedOptions.reverse) {
              setProducts(products?.reverse());
              setOrderedOptions({ ...orderedOptions, reverse: true });
            }
            break;
        }
      } else {
        setProducts(data);
      }
    },
  });

  const { data: categoriesData } = api.category.getAll.useQuery();

  const deleteProducts = api.product.deleteMany.useMutation({
    onSuccess: () => {
      void refetchProducts();
    },
  });

  const updateName = api.updateProduct.updateName.useMutation({
    onSuccess: () => {
      void refetchProducts();
    },
  });

  const updatePrice = api.updateProduct.updatePrice.useMutation({
    onSuccess: () => {
      void refetchProducts();
    },
  });

  const updateStock = api.updateProduct.updateStock.useMutation({
    onSuccess: () => {
      void refetchProducts();
    },
  });

  // const updateCategory = api.updateProduct.updateCategory.useMutation({
  //   onSuccess: () => {
  //     void refetchProducts();
  //   },
  // });

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
      if (products && products[index] && !isProductsLoading) {
        toggle.checked = products[index]?.active || toggle.checked;
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
  }, [isProductsLoading, products]);

  return (
    <>
      <Head>
        <title>Loft 35 - Products</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div>
          <div className="relative overflow-x-auto w-full">
            {editInputProperties?.active && (
              <div className="relative">
                <input
                  type={editInputProperties.type}
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
                    display: `${
                      editInputProperties?.active ? 'block' : 'none'
                    }`,
                  }}
                  defaultValue={editInputProperties.value}
                  className="absolute input input-primary z-20"
                />
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
                  <th
                    onClick={() => {
                      if (orderedOptions?.column === 'category') {
                        setOrderedOptions({
                          column: 'category',
                          reverse: !orderedOptions?.reverse,
                        });
                        setProducts(products?.reverse());
                      } else {
                        setProducts(
                          products?.sort((a, b) =>
                            a.categoryName.localeCompare(b.categoryName)
                          )
                        );
                        setOrderedOptions({
                          column: 'category',
                          reverse: false,
                        });
                      }
                    }}
                  >
                    <div className="flex justify-between ">
                      Categoría
                      {orderedOptions?.column === 'category' && (
                        <span className="swap swap-rotate">
                          <svg
                            viewBox="0 0 30 30"
                            height={12}
                            width={12}
                            fill="currentColor"
                            stroke="currentColor"
                            className={`${
                              orderedOptions.reverse ? 'rotate-180' : ''
                            } swap-active`}
                          >
                            <polygon points="15,17.4 4.8,7 2,9.8 15,23 28,9.8 25.2,7 "></polygon>
                          </svg>
                        </span>
                      )}
                    </div>
                  </th>
                  <th>Disponibles</th>
                  <th
                    onClick={() => {
                      if (orderedOptions?.column === 'name') {
                        setOrderedOptions({
                          column: 'name',
                          reverse: !orderedOptions?.reverse,
                        });
                        setProducts(products?.reverse());
                      } else {
                        setProducts(
                          products?.sort((a, b) => a.name.localeCompare(b.name))
                        );
                        setOrderedOptions({
                          column: 'name',
                          reverse: false,
                        });
                      }
                    }}
                  >
                    <div className="flex justify-between ">
                      Nombre
                      {orderedOptions?.column === 'name' && (
                        <span className="swap swap-rotate">
                          <svg
                            viewBox="0 0 30 30"
                            height={12}
                            width={12}
                            fill="currentColor"
                            stroke="currentColor"
                            className={`${
                              orderedOptions.reverse ? 'rotate-180' : ''
                            } swap-active`}
                          >
                            <polygon points="15,17.4 4.8,7 2,9.8 15,23 28,9.8 25.2,7 "></polygon>
                          </svg>
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (orderedOptions?.column === 'price') {
                        setOrderedOptions({
                          column: 'price',
                          reverse: !orderedOptions?.reverse,
                        });
                        setProducts(products?.reverse());
                      } else {
                        setProducts(
                          products?.sort((a, b) => a.price - b.price)
                        );
                        setOrderedOptions({
                          column: 'price',
                          reverse: false,
                        });
                      }
                    }}
                  >
                    <div className="flex justify-between ">
                      Precio
                      {orderedOptions?.column === 'price' && (
                        <span className="swap swap-rotate">
                          <svg
                            viewBox="0 0 30 30"
                            height={12}
                            width={12}
                            fill="currentColor"
                            stroke="currentColor"
                            className={`${
                              orderedOptions.reverse ? 'rotate-180' : ''
                            } swap-active`}
                          >
                            <polygon points="15,17.4 4.8,7 2,9.8 15,23 28,9.8 25.2,7 "></polygon>
                          </svg>
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (orderedOptions?.column === 'stock') {
                        setOrderedOptions({
                          column: 'stock',
                          reverse: !orderedOptions?.reverse,
                        });
                        setProducts(products?.reverse());
                      } else {
                        setProducts(
                          products?.sort((a, b) => a.stock - b.stock)
                        );
                        setOrderedOptions({
                          column: 'stock',
                          reverse: false,
                        });
                      }
                    }}
                  >
                    <div className="flex justify-between ">
                      Cantidad
                      {orderedOptions?.column === 'stock' && (
                        <span className="swap swap-rotate">
                          <svg
                            viewBox="0 0 30 30"
                            height={12}
                            width={12}
                            fill="currentColor"
                            stroke="currentColor"
                            className={`${
                              orderedOptions.reverse ? 'rotate-180' : ''
                            } swap-active`}
                          >
                            <polygon points="15,17.4 4.8,7 2,9.8 15,23 28,9.8 25.2,7 "></polygon>
                          </svg>
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (orderedOptions?.column === 'priority') {
                        setOrderedOptions({
                          column: 'priority',
                          reverse: !orderedOptions?.reverse,
                        });
                        setProducts(products?.reverse());
                      } else {
                        setProducts(
                          products?.sort((a, b) => a.priority - b.priority)
                        );
                        setOrderedOptions({
                          column: 'priority',
                          reverse: false,
                        });
                      }
                    }}
                  >
                    <div className="flex justify-between ">
                      Prioridad
                      {orderedOptions?.column === 'priority' && (
                        <span className="swap swap-rotate">
                          <svg
                            viewBox="0 0 30 30"
                            height={12}
                            width={12}
                            fill="currentColor"
                            stroke="currentColor"
                            className={`${
                              orderedOptions.reverse ? 'rotate-180' : ''
                            } swap-active`}
                          >
                            <polygon points="15,17.4 4.8,7 2,9.8 15,23 28,9.8 25.2,7 "></polygon>
                          </svg>
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* rows */}
                {products?.map((product) => {
                  return (
                    <ProductTableRow
                      key={product.id}
                      product={product}
                      categories={categoriesData || []}
                      onEditInputClick={setEditInputProperties}
                      editInputProps={editInputProperties}
                      onCheckBoxToggle={toggleActive.mutate}
                      onUpdateName={updateName.mutate}
                      onUpdatePrice={updatePrice.mutate}
                      onUpdateStock={updateStock.mutate}
                    />
                  );
                })}
              </tbody>
              {/* foot */}
              <tfoot>
                <tr>
                  <th></th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Disponibles</th>
                  <th>Nombre</th>
                  <th>Precio CUP</th>
                  <th>Cantidad</th>
                  <th>Prioridad</th>
                </tr>
              </tfoot>
            </table>
          </div>
          <div>
            <div className="flex flex-row gap-2">
              <div className="w-12"></div>
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
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
