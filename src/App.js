import "./App.css";
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import Todo from "./components/Todo/Todo"
import todosList from "./data/todos.json";
import { useState } from "react";

export default function App() {
  const [currentTodos, setCurrentTodos] = useState(todosList);
  const todos = currentTodos.taches; 

  return (
    <div className="App">
      <Header todos={todos}/>
      <Todo todos={todos} setTodos={setCurrentTodos} />
      <Footer setCurrentTodos={setCurrentTodos}/>
    </div>
  );
}
