import { useContext, useEffect } from 'react';
import Image from 'next/image';
import Error from 'next/error';
import {
  type Category,
  type Product,
  type Image as ProductImage,
} from '@prisma/client';
import ProductForm from '~/components/ProductForm';
import ModalConfirm from '~/components/ModalConfirm';
import {
  DragDropContext,
  Draggable,
  type DroppableProvided,
} from 'react-beautiful-dnd';
import { StrictModeDroppable as Droppable } from '~/helpers/DroppableStrictMode';
import { ChatContext } from '~/context/ChatBubbles';

interface IProps {
  categoriesData: Category[];
  productsData: (Product & {
    primaryImage: ProductImage;
  })[];
  setProductsData: (
    products: (Product & {
      primaryImage: ProductImage;
    })[]
  ) => void;
  refetchProducts: () => void;
  isProductsLoading: boolean;
  orderedOptions: {
    column: string;
    reverse: boolean;
  };
  setOrderedOptions: (orderedOptions: {
    column: string;
    reverse: boolean;
  }) => void;
  deleteProducts: ({ productIds }: { productIds: number[] }) => void;
  updateName: (productId: number) => void;
  updatePrice: (productId: number) => void;
  updateStock: (productId: number) => void;
  changePriorityUp: ({
    productId,
    targetId,
  }: {
    productId: number;
    targetId: number;
  }) => void;
  changePriorityDown: ({
    productId,
    targetId,
  }: {
    productId: number;
    targetId: number;
  }) => void;
  toggleActive: ({
    productId,
    active,
  }: {
    productId: number;
    active: boolean;
  }) => void;
  isAnyProductSelected: boolean;
  setIsAnyProductSelected: (isAnyProductSelected: boolean) => void;
  editInputProperties: {
    left: number;
    top: number;
    width: number;
    height: number;
    active: boolean;
    value: string;
    productId: number;
    type: string;
    column: string;
  };
  setEditInputProperties: (editInputProperties: {
    left: number;
    top: number;
    width: number;
    height: number;
    active: boolean;
    value: string;
    productId: number;
    type: string;
    column: string;
  }) => void;
}

// Define the action types
enum ActionType {
  ADD_MESSAGE = 'ADD_MESSAGE',
  REMOVE_MESSAGE = 'REMOVE_MESSAGE',
}

const ProductTable: React.FC<IProps> = ({
  productsData,
  setProductsData,
  refetchProducts,
  isProductsLoading,
  orderedOptions,
  setOrderedOptions,
  categoriesData,
  deleteProducts,
  updateName,
  updatePrice,
  updateStock,
  changePriorityUp,
  changePriorityDown,
  toggleActive,
  isAnyProductSelected,
  setIsAnyProductSelected,
  editInputProperties,
  setEditInputProperties,
}) => {
  const { dispatchMessage } = useContext(ChatContext);

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
      setIsAnyProductSelected(selectCheckbox.checked);
    });

    checkboxes.forEach((checkBox) => {
      checkBox.addEventListener('change', () => {
        setIsAnyProductSelected(
          Array.from(checkboxes).some((checkbox) => checkbox.checked)
        );
      });
    });
  }, [isProductsLoading, productsData, setIsAnyProductSelected]);

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
                  if (orderedOptions.column === 'category') {
                    setOrderedOptions({
                      column: 'category',
                      reverse: !orderedOptions.reverse,
                    });
                    setProductsData(productsData?.reverse());
                  } else {
                    setProductsData(
                      productsData?.sort((a, b) =>
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
                  {orderedOptions.column === 'category' && (
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
                  if (orderedOptions.column === 'name') {
                    setOrderedOptions({
                      column: 'name',
                      reverse: !orderedOptions.reverse,
                    });
                    setProductsData(productsData?.reverse());
                  } else {
                    setProductsData(
                      productsData?.sort((a, b) => a.name.localeCompare(b.name))
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
                  {orderedOptions.column === 'name' && (
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
                  if (orderedOptions.column === 'price') {
                    setOrderedOptions({
                      column: 'price',
                      reverse: !orderedOptions.reverse,
                    });
                    setProductsData(productsData?.reverse());
                  } else {
                    setProductsData(
                      productsData?.sort((a, b) => a.price - b.price)
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
                  {orderedOptions.column === 'price' && (
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
                  if (orderedOptions.column === 'stock') {
                    setOrderedOptions({
                      column: 'stock',
                      reverse: !orderedOptions.reverse,
                    });
                    setProductsData(productsData?.reverse());
                  } else {
                    setProductsData(
                      productsData?.sort((a, b) => a.stock - b.stock)
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
                  {orderedOptions.column === 'stock' && (
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
                  if (orderedOptions.column === 'priority') {
                    setOrderedOptions({
                      column: 'priority',
                      reverse: !orderedOptions.reverse,
                    });
                    setProductsData(productsData?.reverse());
                  } else {
                    setProductsData(
                      productsData?.sort((a, b) => a.priority - b.priority)
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
                  {orderedOptions.column === 'priority' && (
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
          <DragDropContext
            onDragEnd={(result) => {
              if (
                orderedOptions.column !== 'priority' ||
                orderedOptions.reverse
              ) {
                dispatchMessage({
                  payload: {
                    text: 'Tiene que estar ordenado por prioridad y descendentemente',
                    type: 'error',
                  },
                  type: ActionType.ADD_MESSAGE,
                });
                throw new Error({
                  title:
                    'Tiene que estar ordenado por prioridad y descendentemente',
                  statusCode: 1002,
                });
              }

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
                  changePriorityUp({
                    productId: sourceProductId,
                    targetId: targetProductId,
                  });
                } else if (sourceProductPriority > targetProductPriority) {
                  changePriorityDown({
                    productId: sourceProductId,
                    targetId: targetProductId,
                  });
                }

                const modifiedProducts = productsData;
                const reorderedProduct = modifiedProducts.splice(
                  result.source.index,
                  1
                );
                if (!reorderedProduct[0]) return;
                modifiedProducts.splice(
                  result.destination.index,
                  0,
                  reorderedProduct[0]
                );
                setProductsData(modifiedProducts);
              }
            }}
          >
            <Droppable droppableId="productTable">
              {(provided: DroppableProvided) => (
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {productsData?.map((product, index) => {
                    return (
                      <Draggable
                        key={product.id}
                        draggableId={product.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
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
                                  <div className="font-bold">
                                    {product.name}
                                  </div>
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
                              <div className="flex justify-between items-center w-24">
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
                                  className="select w-full h-[75px] absolute inset-0"
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
                              <input
                                type="checkbox"
                                className="toggle toggle-active"
                                defaultChecked={product.active}
                                onChange={() => {
                                  toggleActive({
                                    productId: product.id,
                                    active: !product.active,
                                  });
                                }}
                              />
                            </td>
                            <th>
                              <div className="flex justify-between">
                                <p
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    const target =
                                      event.currentTarget as HTMLSpanElement;
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
                                      productId: product.id,
                                      type: 'text',
                                      column: 'name',
                                    });
                                  }}
                                >
                                  {product.name}
                                </p>
                                {editInputProperties.active &&
                                  editInputProperties.productId ===
                                    product.id &&
                                  editInputProperties.column === 'name' && (
                                    <div
                                      onClick={() => {
                                        updateName(product.id);
                                      }}
                                      className="fixed inset-0 w-[100vw] h-[100vh] opacity-30 stroke-slate-600"
                                    ></div>
                                  )}
                              </div>
                            </th>
                            <th>
                              <div className="flex justify-between">
                                <p
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    const target =
                                      event.currentTarget as HTMLSpanElement;
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
                                      value: product.price.toString(),
                                      active: true,
                                      productId: product.id,
                                      type: 'number',
                                      column: 'price',
                                    });
                                  }}
                                >
                                  {product.price}
                                </p>
                                {editInputProperties.active &&
                                  editInputProperties.productId ===
                                    product.id &&
                                  editInputProperties.column === 'price' && (
                                    <div
                                      onClick={() => {
                                        updatePrice(product.id);
                                      }}
                                      className="fixed inset-0 w-[100vw] h-[100vh] opacity-30 stroke-slate-600"
                                    ></div>
                                  )}
                              </div>
                            </th>
                            <th>
                              <div className="flex justify-between">
                                <p
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    const target =
                                      event.currentTarget as HTMLSpanElement;
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
                                      value: product.stock.toString(),
                                      active: true,
                                      productId: product.id,
                                      type: 'number',
                                      column: 'stock',
                                    });
                                  }}
                                >
                                  {product.stock}
                                </p>
                                {editInputProperties.active &&
                                  editInputProperties.productId ===
                                    product.id &&
                                  editInputProperties.column === 'stock' && (
                                    <div
                                      onClick={() => {
                                        updateStock(product.id);
                                      }}
                                      className="fixed inset-0 w-[100vw] h-[100vh] opacity-30 stroke-slate-600"
                                    ></div>
                                  )}
                              </div>
                            </th>
                            <th>
                              <p>{product.priority}</p>
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
              deleteProducts({
                productIds: checkedProductsIds,
              });
            }}
            okBtnText="Eliminar"
            isDisabled={!isAnyProductSelected || productsData?.length === 0}
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

export default ProductTable;
