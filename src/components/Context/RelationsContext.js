import { createContext, useState, useContext } from "react";

const RelationsContext = createContext();

export const useRelations = () => useContext(RelationsContext);

export const RelationsProvider = ({ children }) => {

  const [relations, setRelations] = useState(require("../../data/todos.json").relations);

  return (
    <RelationsContext.Provider value={{ relations: relations, setRelations: setRelations }}>
      {children}
    </RelationsContext.Provider>
  );
};
