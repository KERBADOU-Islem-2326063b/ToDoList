import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Todo from "./components/Todo/Todo";
import { TodosProvider } from "./components/Context/TodosContext";
import { CategoriesProvider } from "./components/Context/CategoriesContext";
import { RelationsProvider } from "./components/Context/RelationsContext";

export default function App() {
  return (
    <RelationsProvider>
      <CategoriesProvider>
        <TodosProvider>
            <div className="App">
              <Header />
              <Todo />
              <Footer />
            </div>
        </TodosProvider>
      </CategoriesProvider>
    </RelationsProvider>
  );
}
