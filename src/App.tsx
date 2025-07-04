import { RouterProvider } from 'react-router';
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from './routes/Router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './Store/Store';

import { setCategoryList, setError, setLoading } from './Store/Slices/Categories';

import { setProducts } from './Store/Slices/ProductData';

import { getAllProduct, getCategory } from './AxiosConfig/AxiosConfig';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const filterData = useSelector((state: any) => state.filterData);

  const fetchCategories = useCallback(async () => {
    try {
      dispatch(setError(null));
      const res = await getCategory();
      if (res?.data?.data) {
        dispatch(setCategoryList(res.data.data));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      dispatch(setError('Failed to fetch categories. Please try again.'));
    }
  }, [dispatch]);

  const fetchProducts = useCallback(async () => {
    try {
      dispatch(setError(null));
      dispatch(setLoading(true));

      const data = {
        page: filterData.page,
        limit: filterData.limit,
        search: filterData.search,
        sortBy: filterData.sortBy,
        category: filterData.categories,
        subCategory: filterData.subCategories,
        ProductCategory: filterData.productCategories,
        brands: filterData.Brands,
        ratings: filterData.ratings,
        attributes: filterData.attributes,
        isActive: filterData.isActive,
      };

      const res = await getAllProduct(data);
      dispatch(setProducts(res?.data?.data));
    } catch (error) {
      console.error('Error fetching products:', error);
      dispatch(setError('Failed to fetch products. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, filterData]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <ThemeModeScript />
      <Flowbite theme={{ theme: customTheme }}>
        <RouterProvider router={router} />
      </Flowbite>
    </>
  );
}

export default App;
