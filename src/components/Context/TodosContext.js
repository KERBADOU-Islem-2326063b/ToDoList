import { createContext, useState, useContext } from "react";

const TodosContext = createContext();

export const useTodos = () => useContext(TodosContext);

export const TodosProvider = ({ children }) => {
  
  const [currentTodos, setCurrentTodos] = useState(require("../../data/todos.json").taches);

  return (
    <TodosContext.Provider value={{ todos: currentTodos, setTodos: setCurrentTodos }}>
      {children}
    </TodosContext.Provider>    
  );
};