import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = ({ search = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      if (!search) {
        setError('');
        setProducts([]);
        setIsLoading(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:3035/search`, {
          params: {
            search,
          },
        });
        setError('');
        setProducts(res?.data || []);
      } catch (error) {
        setError('Error in loading');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [search]);

  if (error) {
    return <div className='product-error'>{error}</div>;
  }

  if (isLoading) {
    return <div>Loading....</div>;
  }

  if (products.length == 0) {
    if (search) {
      return (
        <div className='product-empty'>
          No Products. Please search with different keyword...
        </div>
      );
    }
    return null;
  }

  return (
    <div className='product-container'>
      <div className='product-count'>Total: {products.length}</div>
      <div className='product-list'>
        {products.map((product) => (
          <div key={product.id} className='product'>
            <img src={product.picture} />
            <div className='name'>{product.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
