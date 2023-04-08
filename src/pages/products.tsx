import { useEffect, useState } from 'react';
import Head from 'next/head';
import { type Product, type Image as ProductImage } from '@prisma/client';
import { api } from '~/utils/api';
import Layout from '~/layout/Layout';
import ProductsTable from '~/components/ProductsTable';
import ProductsCardScroll from '~/components/ProductsCardScroll';

const Products = () => {
  const [productsView, setProducstView] = useState<'table' | 'cards'>('table');
  const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] = useState(false);
  const [orderedOptions, setOrderedOptions] = useState<{
    column: string;
    reverse: boolean;
  }>({
    column: 'priority',
    reverse: false,
  });

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
    productId: -1,
    type: '',
    column: '',
  });

  const { refetch: refetchProducts, isLoading: isProductsLoading } =
    api.product.getAll.useQuery(undefined, {
      onSuccess: (data) => {
        if (orderedOptions) {
          switch (orderedOptions.column) {
            case 'name':
              setProducts(data.sort((a, b) => a.name.localeCompare(b.name)));
              break;
            case 'category':
              setProducts(
                data.sort((a, b) =>
                  a.categoryName.localeCompare(b.categoryName)
                )
              );
              break;
            case 'price':
              setProducts(data.sort((a, b) => a.price - b.price));
              break;
            case 'priority':
              setProducts(data.sort((a, b) => a.priority - b.priority));
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

  const changePriorityUp = api.updateProduct.changePriorityUp.useMutation({
    onSuccess: () => {
      void refetchProducts();
    },
  });

  const changePriorityDown = api.updateProduct.changePriorityDown.useMutation({
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
        <div className="text-end">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn m-1">
              Vista
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button
                  onClick={() => {
                    setProducstView('table');
                  }}
                >
                  Tabla
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setProducstView('cards');
                  }}
                >
                  Tarjetas
                </button>
              </li>
            </ul>
          </div>
        </div>
        {productsView === 'table' && (
          <ProductsTable
            productsData={products ?? []}
            setProductsData={setProducts}
            refetchProducts={() => {
              void refetchProducts();
            }}
            isProductsLoading={isAnyCheckboxSelected}
            orderedOptions={orderedOptions}
            setOrderedOptions={setOrderedOptions}
            categoriesData={categoriesData ?? []}
            deleteProducts={deleteProducts.mutate}
            updateName={(productId) => {
              const product = products?.find(
                (product) => product.id === productId
              );
              if (!product) {
                throw new Error('ProductId no existe');
              }
              setEditInputProperties({
                ...editInputProperties,
                active: false,
              });
              if (product.name === editInputProperties.value) return;
              updateName.mutate({
                productId: product.id,
                newName: editInputProperties.value,
              });
              product.name = editInputProperties.value;
            }}
            updatePrice={(productId) => {
              const product = products?.find(
                (product) => product.id === productId
              );
              if (!product) {
                throw new Error('ProductId no existe');
              }
              setEditInputProperties({
                ...editInputProperties,
                active: false,
              });
              if (product.price.toString() === editInputProperties.value)
                return;
              updatePrice.mutate({
                productId: product.id,
                newPrice: parseInt(editInputProperties.value),
              });
              product.price = parseInt(editInputProperties.value);
            }}
            updateStock={(productId) => {
              const product = products?.find(
                (product) => product.id === productId
              );
              if (!product) {
                throw new Error('ProductId no existe');
              }
              setEditInputProperties({
                ...editInputProperties,
                active: false,
              });
              if (product.stock.toString() === editInputProperties.value)
                return;
              updateStock.mutate({
                productId: product.id,
                newStock: parseInt(editInputProperties.value),
              });
              product.stock = parseInt(editInputProperties.value);
            }}
            changePriorityUp={changePriorityUp.mutate}
            changePriorityDown={changePriorityDown.mutate}
            changePriorityLoading={
              changePriorityUp.isLoading || changePriorityDown.isLoading
            }
            toggleActive={toggleActive.mutate}
            isAnyProductSelected={isAnyCheckboxSelected}
            setIsAnyProductSelected={setIsAnyCheckboxSelected}
            editInputProperties={editInputProperties}
            setEditInputProperties={setEditInputProperties}
          />
        )}
        {productsView === 'cards' && (
          <ProductsCardScroll productsData={products ?? []} />
        )}
      </Layout>
    </>
  );
};

export default Products;
