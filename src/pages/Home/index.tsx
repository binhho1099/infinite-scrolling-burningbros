import { useEffect, useRef, useState, useCallback } from 'react';
import AppSearch from '../../components/AppSearch';
import CartProduct from '../../components/CardProduct';
import { PRODUCT_ENDPOINT } from '../../enums/endpoint';
import useDebounce from '../../hooks/useDebounce';
import { IProduct } from '../../shared/interfaces/product.interface';

function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [page, setPage] = useState(0);
  const hasMoreRef = useRef(true);

  const [searchValue, setSearchValue] = useState('');
  const searchValueDebounce = useDebounce(searchValue, 500);

  const limit = 20;
  const lastProductRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchDataProducts = useCallback(async () => {
    if (isLoading || !hasMoreRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const base = `https://dummyjson.com${PRODUCT_ENDPOINT.ALL_PRODUCT}`;
      const url = searchValueDebounce
        ? `${base}/search?limit=${limit}&skip=${page * limit}&q=${searchValueDebounce}`
        : `${base}?limit=${limit}&skip=${page * limit}`;

      const res = await fetch(url);
      const data = await res.json();

      const newProducts = data.products ?? [];

      if (page === 0) {
        setProducts(newProducts); // search mới → reset
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }

      hasMoreRef.current = newProducts.length === limit;
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err);
    }

    setIsLoading(false);
  }, [page, searchValueDebounce, isLoading]);

  // Reset khi search
  useEffect(() => {
    setProducts([]);
    setPage(0);
    hasMoreRef.current = true;
  }, [searchValueDebounce]);

  // Fetch mỗi khi page thay đổi
  useEffect(() => {
    fetchDataProducts();
  }, [page, fetchDataProducts]);

  // Intersection Observer
  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreRef.current && !isLoading) {
        setPage(prev => prev + 1);
      }
    });

    if (lastProductRef.current) {
      observer.current.observe(lastProductRef.current);
    }
  }, [products, isLoading]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className="container gutter">
      <div className="row gy-2 gx-2 gy-sm-3 gx-sm-3">
        <div className="p-3 bg-light position-sticky" style={{ top: 0, zIndex: 1 }}>
          <AppSearch value={searchValue} onChange={handleSearchChange} />
        </div>

        {products.length > 0 ? (
          products.map((product, index) => {
            const isLast = index === products.length - 1;
            return (
              <div
                key={product.id}
                className="col col-6 col-xl-3 col-lg-4"
                ref={isLast ? lastProductRef : null}
              >
                <CartProduct product={product} />
              </div>
            );
          })
        ) : (
          !isLoading && <h3 className="text-center">Không tìm thấy sản phẩm</h3>
        )}

        {isLoading && (
          <div className="col col-12 text-center">
            <div className="spinner-border text-primary"></div>
          </div>
        )}

        {error && !isLoading && <div className="col col-12 text-center">Opps…</div>}
      </div>
    </div>
  );
}

export default Home;
