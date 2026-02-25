import { createContext, useContext, useEffect, useState } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
   const [compareList, setCompareList] = useState([]);

   useEffect(() => {
      const storedCompare = JSON.parse(localStorage.getItem('compareList')) || [];
      setCompareList(storedCompare);
   }, []);

   const addToCompare = (product) => {
      if (compareList.some((p) => p.product_id === product.product_id)) {
         return;
      }

      if (compareList.length >= 3) {
         return;
      }

      const updatedList = [...compareList, product];
      setCompareList(updatedList);
      localStorage.setItem('compareList', JSON.stringify(updatedList));
   };

   const removeFromCompare = (productId) => {
      const updatedList = compareList.filter((p) => p.product_id !== productId);
      setCompareList(updatedList);
      localStorage.setItem('compareList', JSON.stringify(updatedList));
   };

   const clearAllCompare = () => {
      setCompareList([]);
      localStorage.removeItem('compareList');
   };

   return (
      <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearAllCompare }}>
         {children}
      </CompareContext.Provider>
   );
};

export const useCompare = () => {
   return useContext(CompareContext);
};
