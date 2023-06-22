import React from 'react';
import { IProduct } from '../../shared/interfaces/product.interface';

interface ICardProductProps {
  product: IProduct;
}

const CartProduct = React.memo(({ product }: ICardProductProps) => {
  return (
    <div className="card card-product h-100">
      <img
        className="card-img-top"
        src={product.thumbnail}
        alt={product.title}
      />
      <div className="card-body">
        <h4 className="card-title">{product.title}</h4>
        <p className="card-text">{product.description}</p>
      </div>
    </div>
  );
});

export default CartProduct;
