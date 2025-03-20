import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Todo from "./components/Todo/Todo";
import { TodosProvider } from "./components/Context/TodosContext";

export default function App() {
  return (
    <TodosProvider>
      <div className="App">
        <Header />
        <Todo />
        <Footer />
      </div>
    </TodosProvider>
  );
}
