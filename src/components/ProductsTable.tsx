import { useEffect, useState } from 'react';
import Image from 'next/image';
import ProductForm from '~/components/ProductForm';
import ModalConfirm from '~/components/ModalConfirm';
import {
  DragDropContext,
  Draggable,
  type DroppableProvided,
} from 'react-beautiful-dnd';
import { StrictModeDroppable as Droppable } from '~/helpers/DroppableStrictMode';
import { api } from '~/utils/api';

const ProductsTable: React.FC = () => {
  const [isAnyProductSelected, setIsAnyProductSelected] = useState(false);
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

  const {
    data: productsData,
    refetch: refetchProducts,
    isLoading: isProductsLoading,
  } = api.product.getAll.useQuery();

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

    if (!selectCheckbox || !checkboxes || !togglesActives) return;

    togglesActives.forEach((toggle, index) => {
      if (productsData && productsData[index]) {
        toggle.checked = productsData[index]?.active || toggle.checked;
      }
    });

    selectCheckbox.addEventListener('click', () => {
      checkboxes.forEach((checkBox) => {
        checkBox.checked = selectCheckbox.checked;
      });
      setIsAnyProductSelected(selectCheckbox.checked);
    });

    checkboxes.forEach((checkBox) => {
      checkBox.addEventListener('change', () => {
        setIsAnyProductSelected(
          Array.from(checkboxes).some((checkbox) => checkbox.checked)
        );
      });
    });
  }, [productsData, setIsAnyProductSelected]);

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

  const setActive = api.product.setActive.useMutation({
    onSuccess: () => {
      void refetchProducts();
    },
  });

  return (
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
                display: `${editInputProperties?.active ? 'block' : 'none'}`,
              }}
              defaultValue={editInputProperties.value}
              className="absolute input input-primary shadow-lg z-20"
            />
          </div>
        )}
        <table className="table table-compact table-zebra w-full">
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
              <th></th>
              <th>Producto</th>
              <th>
                <div className="flex justify-between ">Categoría</div>
              </th>
              <th>Disponibles</th>
              <th>
                <div className="flex justify-between ">Nombre</div>
              </th>
              <th>
                <div className="flex justify-between ">Precio</div>
              </th>
              <th>
                <div className="flex justify-between ">Cantidad</div>
              </th>
            </tr>
          </thead>
          {!isProductsLoading ? (
            <DragDropContext
              onDragEnd={(result) => {
                if (result.destination && productsData) {
                  const sourceProductPriority =
                    productsData[result.source.index]?.priority;
                  const targetProductPriority =
                    productsData[result.destination.index]?.priority;

                  const sourceProductId = productsData[result.source.index]?.id;
                  const targetProductId =
                    productsData[result.destination.index]?.id;

                  if (!sourceProductPriority || !targetProductPriority) return;

                  if (!sourceProductId || !targetProductId) return;

                  if (sourceProductPriority < targetProductPriority) {
                    changePriorityUp.mutate({
                      productId: sourceProductId,
                      targetId: targetProductId,
                    });
                  } else if (sourceProductPriority > targetProductPriority) {
                    changePriorityDown.mutate({
                      productId: sourceProductId,
                      targetId: targetProductId,
                    });
                  }

                  const reorderedProduct = productsData.splice(
                    result.source.index,
                    1
                  );
                  if (!reorderedProduct[0]) return;
                  productsData.splice(
                    result.destination.index,
                    0,
                    reorderedProduct[0]
                  );
                }
              }}
            >
              <Droppable droppableId="productsTable">
                {(provided: DroppableProvided) => (
                  <tbody {...provided.droppableProps} ref={provided.innerRef}>
                    {productsData?.map((product, index) => {
                      return (
                        <Draggable
                          key={product.id}
                          draggableId={product.id.toString()}
                          index={index}
                          isDragDisabled={
                            changePriorityUp.isLoading ||
                            changePriorityDown.isLoading
                          }
                        >
                          {(provided) => (
                            <tr
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                            >
                              <th>
                                <label>
                                  <input
                                    type="checkbox"
                                    className="checkbox select-checkbox-group"
                                  />
                                </label>
                              </th>
                              <th {...provided.dragHandleProps}>
                                <svg
                                  viewBox="0 0 10 10"
                                  className="dragHandle"
                                  style={{
                                    width: '14px',
                                    height: '14px',
                                    display: 'block',
                                    fill: 'currentColor',
                                    flexShrink: '0',
                                    backfaceVisibility: 'hidden',
                                  }}
                                >
                                  <path d="M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z"></path>
                                </svg>
                              </th>
                              <td>
                                <div className="flex items-center space-x-3 min-w-[190px]">
                                  <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12">
                                      <Image
                                        src={product.imageName}
                                        alt="Avatar Tailwind CSS Component"
                                        width={48}
                                        height={48}
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full">
                                    <div className="font-bold">
                                      {product.name}
                                    </div>
                                    <div className="flex justify-around items-center flex-row">
                                      <div className="text-sm opacity-50">
                                        ${product.price}
                                      </div>
                                      <div
                                        className={`badge badge-sm text-sm badge-${product.active ? 'success' : 'warning'
                                          } gap-2`}
                                      >
                                        {product.active ? 'active' : 'disabled'}
                                      </div>
                                      <div
                                        className={`badge badge-sm text-sm badge-info gap-2`}
                                      >
                                        {product.id}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="relative">
                                <div className="flex justify-between items-center min-w-[120px]">
                                  <select
                                    onChange={(e) => {
                                      if (e.target.value === 'Añadir') {
                                        setEditInputProperties({
                                          ...editInputProperties,
                                          value: e.target.value,
                                        });
                                        return;
                                      }
                                      setEditInputProperties({
                                        ...editInputProperties,
                                        active: false,
                                        productId: product.id,
                                        column: 'category',
                                        type: 'text',
                                        value: e.target.value,
                                      });
                                    }}
                                    value={product.categoryId}
                                    className="select bg-transparent w-full absolute"
                                  >
                                    {categoriesData?.map((category) => (
                                      <option
                                        key={category.id}
                                        value={category.id}
                                      >
                                        {category.name}
                                      </option>
                                    ))}
                                    <option
                                      onClick={() => {
                                        console.log(
                                          'El usuario quiere cambiar la categoría'
                                        );
                                      }}
                                      value={'Añadir'}
                                      className="btn"
                                    >
                                      + Añadir
                                    </option>
                                  </select>
                                </div>
                              </td>
                              <td>
                                <div className="flex justify-center items-center min-w-[60px]">
                                  <input
                                    type="checkbox"
                                    className="toggle toggle-active"
                                    defaultChecked={product.active}
                                    onChange={() => {
                                      setActive.mutate({
                                        productId: product.id,
                                        active: !product.active,
                                      });
                                    }}
                                  />
                                </div>
                              </td>
                              <th
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  const target =
                                    event.currentTarget as HTMLSpanElement;

                                  const position = {
                                    x: target?.offsetLeft,
                                    y: target?.offsetTop,
                                  };
                                  const size = {
                                    width: target?.offsetWidth,
                                    height: target?.offsetHeight,
                                  };

                                  setEditInputProperties({
                                    left: position.x,
                                    top: position.y,
                                    height: size.height,
                                    width: size.width,
                                    value: product.name,
                                    active: true,
                                    productId: product.id,
                                    type: 'text',
                                    column: 'name',
                                  });
                                }}
                              >
                                <div className="flex justify-between ">
                                  <p className="w-full">{product.name}</p>
                                  {editInputProperties.active &&
                                    editInputProperties.productId ===
                                    product.id &&
                                    editInputProperties.column === 'name' && (
                                      <div
                                        onClick={(e) => {
                                          e.stopPropagation();

                                          setEditInputProperties({
                                            ...editInputProperties,
                                            active: false,
                                          });
                                          if (
                                            product.name ===
                                            editInputProperties.value
                                          )
                                            return;
                                          updateName.mutate({
                                            productId: product.id,
                                            newName: editInputProperties.value,
                                          });
                                          product.name =
                                            editInputProperties.value;
                                        }}
                                        className="fixed inset-0 w-[100vw] h-[100vh] opacity-30 stroke-slate-600"
                                      ></div>
                                    )}
                                </div>
                              </th>
                              <th
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  const target =
                                    event.currentTarget as HTMLSpanElement;

                                  const position = {
                                    x: target?.offsetLeft,
                                    y: target?.offsetTop,
                                  };
                                  const size = {
                                    width: target?.offsetWidth,
                                    height: target?.offsetHeight,
                                  };

                                  setEditInputProperties({
                                    left: position.x,
                                    top: position.y,
                                    height: size.height,
                                    width: size.width,
                                    value: product.price.toString(),
                                    active: true,
                                    productId: product.id,
                                    type: 'number',
                                    column: 'price',
                                  });
                                }}
                              >
                                <div className="flex justify-between">
                                  <p>{product.price}</p>
                                  {editInputProperties.active &&
                                    editInputProperties.productId ===
                                    product.id &&
                                    editInputProperties.column === 'price' && (
                                      <div
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();

                                          setEditInputProperties({
                                            ...editInputProperties,
                                            active: false,
                                          });
                                          if (
                                            product.price.toString() ===
                                            editInputProperties.value
                                          )
                                            return;
                                          updatePrice.mutate({
                                            productId: product.id,
                                            newPrice: parseInt(
                                              editInputProperties.value
                                            ),
                                          });
                                          product.price = parseInt(
                                            editInputProperties.value
                                          );
                                        }}
                                        className="fixed inset-0 w-[100vw] h-[100vh] opacity-30 stroke-slate-600"
                                      ></div>
                                    )}
                                </div>
                              </th>
                              <th
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  const target =
                                    event.currentTarget as HTMLSpanElement;

                                  const position = {
                                    x: target?.offsetLeft,
                                    y: target?.offsetTop,
                                  };
                                  const size = {
                                    width: target?.offsetWidth,
                                    height: target?.offsetHeight,
                                  };

                                  setEditInputProperties({
                                    left: position.x,
                                    top: position.y,
                                    height: size.height,
                                    width: size.width,
                                    value: product.stock.toString(),
                                    active: true,
                                    productId: product.id,
                                    type: 'number',
                                    column: 'stock',
                                  });
                                }}
                              >
                                <div className="flex justify-between">
                                  <p>{product.stock}</p>
                                  {editInputProperties.active &&
                                    editInputProperties.productId ===
                                    product.id &&
                                    editInputProperties.column === 'stock' && (
                                      <div
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();

                                          setEditInputProperties({
                                            ...editInputProperties,
                                            active: false,
                                          });
                                          if (
                                            product.stock.toString() ===
                                            editInputProperties.value
                                          )
                                            return;
                                          updateStock.mutate({
                                            productId: product.id,
                                            newStock: parseInt(
                                              editInputProperties.value
                                            ),
                                          });
                                          product.stock = parseInt(
                                            editInputProperties.value
                                          );
                                        }}
                                        className="fixed inset-0 w-[100vw] h-[100vh] opacity-30 stroke-slate-600"
                                      ></div>
                                    )}
                                </div>
                              </th>
                            </tr>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <tbody>
              {Array(12)
                .fill(0)
                .map((_, index) => (
                  <tr key={index}>
                    <th>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox select-checkbox-group"
                        />
                      </label>
                    </th>
                    <th>
                      <svg
                        viewBox="0 0 10 10"
                        className="dragHandle"
                        style={{
                          width: '14px',
                          height: '14px',
                          display: 'block',
                          fill: 'currentColor',
                          flexShrink: '0',
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        <path d="M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z"></path>
                      </svg>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3 min-w-[190px]">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12 opacity-30 bg-gradient-to-br from-primary to-secondary animate-pulse"></div>
                        </div>
                        <div className="flex w-full justify-around items-center flex-row">
                          <div className="badge badge-sm w-24 text-sm gap-2 opacity-30 bg-gradient-to-br from-primary to-secondary animate-pulse"></div>
                          <div
                            className={`badge badge-sm w-6 text-sm badge-info gap-2 opacity-30 bg-gradient-to-br from-primary to-secondary animate-pulse`}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="relative">
                      <div className="flex justify-between items-center min-w-[120px]">
                        <select className="select bg-transparent w-full absolute">
                          <option value={'Añadir'} className="btn">
                            + Añadir
                          </option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center items-center min-w-[60px]">
                        <input
                          type="checkbox"
                          className="toggle toggle-active"
                        />
                      </div>
                    </td>
                    <th>
                      <div className="flex justify-between ">
                        <div className="badge badge-sm w-24 text-sm gap-2 opacity-30 bg-gradient-to-br from-primary to-secondary animate-pulse"></div>
                      </div>
                    </th>
                    <th>
                      <div className="flex justify-between">
                        <div className="badge badge-sm w-24 text-sm gap-2 opacity-30 bg-gradient-to-br from-primary to-secondary animate-pulse"></div>
                      </div>
                    </th>
                    <th>
                      <div className="flex justify-between">
                        <div className="badge badge-sm w-24 text-sm gap-2 opacity-30 bg-gradient-to-br from-primary to-secondary animate-pulse"></div>
                      </div>
                    </th>
                  </tr>
                ))}
            </tbody>
          )}

          <tfoot>
            <tr>
              <th></th>
              <th></th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Disponibles</th>
              <th>Nombre</th>
              <th>Precio CUP</th>
              <th>Cantidad</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="bg-base-100 p-2 rounded-md">
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
                productIds: checkedProductsIds,
              });
            }}
            okBtnText="Eliminar"
            isDisabled={!isAnyProductSelected || isProductsLoading}
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
  );
};

export default ProductsTable;
