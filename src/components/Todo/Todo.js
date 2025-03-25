import "./Todo.css";import React, { useState } from "react";
import { useTodos } from "../Context/TodosContext";
import { useCategories } from "../Context/CategoriesContext";
import { useRelations } from "../Context/RelationsContext";
import { ETATS, ETAT_TERMINE } from "../Enums/Etats";

const TodoList = () => {
  const { todos, setTodos } = useTodos();
  const { categories } = useCategories();
  const { relations } = useRelations();
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date_echeance");
  const [viewMode, setViewMode] = useState("Tache");

  const filteredTodos = todos.filter((tache) => {
    if (filter === "All") {
      return tache.etat !== "Resussi";
    }
    return tache.etat === filter;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "date_creation") {
      return new Date(a.date_creation) - new Date(b.date_creation);
    } else if (sortBy === "date_echeance") {
      return new Date(a.date_echeance) - new Date(b.date_echeance);
    } else if (sortBy === "nom") {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    }
    return 0;
  });

  const filteredAndSortedCategories = categories.map((category) => {
    const relatedTodos = relations
      .filter((relation) => relation.categorie === category.id)
      .map((relation) => todos.find((tache) => tache.id === relation.tache))
      .filter((tache) => tache);

    const filteredRelatedTodos = relatedTodos.filter((tache) => {
      if (filter === "All") {
        return tache.etat !== "Resussi";
      }
      return tache.etat === filter;
    });

    const sortedRelatedTodos = [...filteredRelatedTodos].sort((a, b) => {
      if (sortBy === "date_creation") {
        return new Date(a.date_creation) - new Date(b.date_creation);
      } else if (sortBy === "date_echeance") {
        return new Date(a.date_echeance) - new Date(b.date_echeance);
      } else if (sortBy === "nom") {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      }
      return 0;
    });

    return { category, sortedRelatedTodos };
  });

  const handleEtatChange = (tacheId, newEtat) => {
    const updatedTodos = todos.map(tache =>
      tache.id === tacheId ? { ...tache, etat: newEtat } : tache
    );
    setTodos(updatedTodos);
  };

  const handleUrgentChange = (tacheId) => {
    const updatedTodos = todos.map(tache =>
      tache.id === tacheId ? { ...tache, urgent: !tache.urgent } : tache
    );
    setTodos(updatedTodos);
  };

  const [expandedTodoId, setExpandedTodoId] = useState(null);

  const toggleTodoExpand = (tacheId) => {
    setExpandedTodoId(expandedTodoId === tacheId ? null : tacheId);
  };


  return (
    <main>
      <h2>Liste des tâches</h2>

      <div className="controls">
        <div className="filters">
          <div className="filter-items">
            <label>Filtrer par état: </label>
            <select onChange={(e) => setFilter(e.target.value)} value={filter}>
              <option value="All">Tous</option>
              {Object.values(ETATS).map((etat) => (
                <option key={etat.name} value={etat.name}>{etat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-items">
            <label>Filtrer par date/nom: </label>
            <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
              <option value="date_echeance">Date d'échéance</option>
              <option value="date_creation">Date de création</option>
              <option value="nom">Nom</option>
            </select>
          </div>
        </div>

        <button
          className="toggle-view-btn"
          onClick={() => setViewMode(viewMode === "Tache" ? "Categorie" : "Tache")}
        >
          Basculer en mode {viewMode === "Tache" ? "Catégorie" : "Tâche"}
        </button>
      </div>

      {viewMode === "Tache" ? (
        <ul>
          {sortedTodos.map((tache) => (
            <li
              key={tache.id}
              className={`todo-item ${tache.etat.toLowerCase().replace(/ /g, '')} ${tache.urgent ? 'urgent' : ''}`}
            >
              <div className="todo-item-header">
                <strong className={ETAT_TERMINE.some(etat => etat.name === tache.etat) ? "strikethrough" : ""}>{tache.title}</strong>
                <div className="todo-item-actions">
                  <select
                    value={tache.etat}
                    onChange={(e) => handleEtatChange(tache.id, e.target.value)}
                  >
                    {Object.values(ETATS).map((etat) => (
                      <option key={etat.name} value={etat.name}>{etat.name}</option>
                    ))}
                  </select>
                  <label>
                    Urgent:
                    <input
                      type="checkbox"
                      checked={tache.urgent}
                      onChange={() => handleUrgentChange(tache.id)}
                    />
                  </label>
                  <button className="expand-btn" onClick={() => toggleTodoExpand(tache.id)}>
                    {expandedTodoId === tache.id ? '▲' : '▼'}
                  </button>
                </div>
              </div>
              <div className="todo-item-details">
                <p>Date d'échéance: {tache.date_echeance}</p>
                {expandedTodoId === tache.id && (
                  <div className="task-details">
                    <p>{tache.description || "Aucune description disponible"}</p>
                    <p>Date de création: {tache.date_creation}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="category-list">
          {filteredAndSortedCategories.length > 0 ? (
            filteredAndSortedCategories.map(({ category, sortedRelatedTodos }) => (
              <li key={category.id}>
                <strong>{category.title}</strong>

                {sortedRelatedTodos.length > 0 ? (
                  <ul>
                    {sortedRelatedTodos.map((tache) => (
                      <li
                        key={tache.id}
                        className={`todo-item ${tache.etat.toLowerCase().replace(/ /g, '')} ${tache.urgent ? 'urgent' : ''}`}
                      >
                         <div className="todo-item-header">
                            <strong className={ETAT_TERMINE.some(etat => etat.name === tache.etat) ? "strikethrough" : ""}>{tache.title}</strong>
                            <div className="todo-item-actions">
                              <select
                                value={tache.etat}
                                onChange={(e) => handleEtatChange(tache.id, e.target.value)}
                              >
                                {Object.values(ETATS).map((etat) => (
                                  <option key={etat.name} value={etat.name}>{etat.name}</option>
                                ))}
                              </select>
                              <label>
                                Urgent:
                                <input
                                  type="checkbox"
                                  checked={tache.urgent}
                                  onChange={() => handleUrgentChange(tache.id)}
                                />
                              </label>
                              <button className="expand-btn" onClick={() => toggleTodoExpand(tache.id)}>
                                {expandedTodoId === tache.id ? '▲' : '▼'}
                              </button>
                            </div>
                          </div>
                          <div className="todo-item-details">
                            <p>Date d'échéance: {tache.date_echeance}</p>
                            {expandedTodoId === tache.id && (
                              <div className="task-details">
                                <p>{tache.description || "Aucune description disponible"}</p>
                                <p>Date de création: {tache.date_creation}</p>
                              </div>
                            )}
                          </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucune tâche liée à cette catégorie</p>
                )}
              </li>
            ))
          ) : (
            <p>Aucune catégorie disponible.</p>
          )}
        </ul>
      )}
    </main>
  );
};

export default TodoList;