import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Todo from "./components/Todo/Todo";
import { TodosProvider } from "./components/Context/TodosContext";
import { CategoriesProvider } from "./components/Context/CategoriesContext";
import { RelationsProvider } from "./components/Context/RelationsContext";
import DataLoader from "./components/Dataloader/Dataloader";
import { useState } from "react";

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleDataLoaded = () => {
    setDataLoaded(true);
  };

  return (
    <RelationsProvider>
      <CategoriesProvider>
        <TodosProvider>
          <div className="App">
            {!dataLoaded ? (
              <DataLoader onDataLoaded={handleDataLoaded} />
            ) : (
              <>
                <Header />
                <Todo />
                <Footer />
              </>
            )}
          </div>
        </TodosProvider>
      </CategoriesProvider>
    </RelationsProvider>
  );
}