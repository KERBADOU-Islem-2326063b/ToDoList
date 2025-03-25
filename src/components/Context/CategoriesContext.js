import { createContext, useState, useContext } from "react";

const CategoriesContext = createContext();

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesProvider = ({ children }) => {
    
  const [categories, setCategories] = useState(require("../../data/todos.json").categories);

  return (
    <CategoriesContext.Provider value={{ categories: categories, setCategories: setCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
};
