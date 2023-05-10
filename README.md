# Loft35

## Made with T3 stack

Product and Category: The relationship between Product and Category is a one-to-many relationship. A category can have multiple products, but each product can only belong to one category. This is indicated by the

```
categoryId
```

field in the Product model, which is a foreign key referencing the Category model, and the

```
products
```

field in the Category model, which is an array of products that belong to the category.

- Customer, Order, Payment, and Shipping: The relationship between these models is a one-to-many relationship as well. A customer can have multiple orders, an order can have multiple products, and each order can have one payment and one shipping information. This is indicated by the foreign keys in the Order, Payment, and Shipping models that reference the Customer and Order models respectively.

- Products and Images: The relationship between Product and Image is a one-to-many relationship. A product can have multiple images, but each image can belong to only one product. This is indicated by the

```
productId
```

field in the Image model, which is a foreign key referencing the Product model, and the

```
primaryImage
```

and

```
secondaryImages
```

fields in the Product model, which indicate the primary and secondary images of the product respectively.
