import "./Todo.css";
import React from "react";

function Todo({ todos = [], setTodos }) {
  const [filter, setFilter] = React.useState("All");

  return (
    <main>
      <h2>Liste des tâches</h2>

      <ul>
        {todos.map((tache) => (
          <li
            key={tache.id}
            className={`todo-item ${tache.etat.toLowerCase()} ${tache.urgent ? 'urgent' : ''}`}
          >
            <strong className={tache.etat === "Reussi" ? "strikethrough" : ""}>{tache.title}</strong>  ({tache.etat})

            <div className="task-details">
              <p>{tache.description || "Aucune description disponible"}</p>
              <p>Date de création: {tache.date_creation}</p>
              <p>Date d'échéance: {tache.date_echeance}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Todo;
