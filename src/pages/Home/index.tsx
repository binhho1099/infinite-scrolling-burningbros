import React, { useEffect, useRef, useState } from 'react';
import { PRODUCT_ENDPOINT } from '../../enums/endpoint';
import { IProduct } from '../../shared/interfaces/product.interface';
import CartProduct from '../../components/CardProduct';
import useDebounce from '../../hooks/useDebounce';
import AppButton from '../../components/AppSearch';
import AppSearch from '../../components/AppSearch';

function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangesSearch, setIsChangesSearch] = useState(false);
  const [error, setError] = useState<any>(null);
  const [page, setPage] = useState<number>(0);
  const hasScrollRef = useRef<boolean>(true);

  const [searchValue, setSearchValue] = useState<string>('');
  const searchValueDebounce = useDebounce(searchValue, 500);

  const limit = 20;

  const lastProductRef = useRef(null);

  const fetchDataProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://dummyjson.com${PRODUCT_ENDPOINT.ALL_PRODUCT}${
          searchValueDebounce && '/search'
        }?limit=${limit}&skip=${page * limit}${
          searchValueDebounce && `&q=${searchValueDebounce}`
        }`
      );
      const data = await response.json();
      if (data.products.length === 0) {
        hasScrollRef.current = false;
        setIsLoading(false);
        if (isChangesSearch) {
          setProducts(data.products);
          setIsChangesSearch(false);
        }
      } else {
        if (isChangesSearch) {
          setProducts(data.products);
          setIsChangesSearch(false);
          setPage(prev => prev + 1);
        } else {
          setProducts(prevProducts => [...prevProducts, ...data.products]);
          setPage(prev => prev + 1);
        }
        setIsLoading(false);
        hasScrollRef.current = true;
      }
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  const handleObserver = (entries: any) => {
    if (entries[0].isIntersecting && hasScrollRef.current) {
      fetchDataProducts();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.5,
    });

    if (observer && lastProductRef.current) {
      observer.observe(lastProductRef.current);
    }

    return () => {
      if (lastProductRef.current) {
        observer.disconnect();
      }
    };
  }, [products]);

  useEffect(() => {
    fetchDataProducts();
  }, [searchValueDebounce]);

  const renderListProduct = products.map((product, index) => {
    if (products.length === index + 1) {
      return (
        <div
          className="col col-6  col-xl-3 col-lg-4"
          key={product.id}
          ref={lastProductRef}
        >
          <CartProduct product={product} />
        </div>
      );
    } else {
      return (
        <div className="col col-6  col-xl-3 col-lg-4" key={product.id}>
          <CartProduct product={product} />
        </div>
      );
    }
  });

  const handleOnChangeSearch = (value: string) => {
    setSearchValue(value);
    setIsChangesSearch(true);
    setPage(0);
  };

  return (
    <div className="container gutter">
      <div className="row gy-2 gx-2 gy-sm-3  gx-sm-3">
        <div
          className="p-3 bg-light position-sticky "
          style={{ top: 0, zIndex: 1 }}
        >
          <AppSearch value={searchValue} onChange={handleOnChangeSearch} />
        </div>

        {products.length > 0 && !isLoading ? (
          renderListProduct
        ) : (
          <h3 className="text-center">Không tìm thấy sản phẩm</h3>
        )}

        {isLoading && (
          <div className="col col-12 text-center">
            <div className="spinner-border text-primary"></div>
          </div>
        )}

        {error && !isLoading && (
          <div className="col col-12 text-center">Opps...</div>
        )}
      </div>
    </div>
  );
}

export default Home;
