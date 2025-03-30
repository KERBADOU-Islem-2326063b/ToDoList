import "./Todo.css";
import React, { useState } from "react";
import { useTodos } from "../Context/TodosContext";
import { useCategories } from "../Context/CategoriesContext";
import { useRelations } from "../Context/RelationsContext";
import { ETATS, ETAT_TERMINE } from "../Enums/Etats";

const TodoList = () => {
  const { todos, setTodos } = useTodos();
  const { categories, setCategories } = useCategories();
  const { relations, setRelations } = useRelations();
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date_echeance");
  const [viewMode, setViewMode] = useState("Tache");
  const [expandedTodoId, setExpandedTodoId] = useState(null);

  const handleDeleteTodo = (tacheId) => {
    setTodos(todos.filter((tache) => tache.id !== tacheId));
    setRelations(relations.filter((relation) => relation.tache !== tacheId));
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
    setRelations(relations.filter((relation) => relation.categorie !== categoryId));
  };

  const toggleTodoExpand = (tacheId) => {
    setExpandedTodoId(expandedTodoId === tacheId ? null : tacheId);
  };

  const handleEtatChange = (tacheId, newEtat) => {
    setTodos(todos.map((tache) => (tache.id === tacheId ? { ...tache, etat: newEtat } : tache)));
  };

  const handleUrgentChange = (tacheId) => {
    setTodos(todos.map((tache) => (tache.id === tacheId ? { ...tache, urgent: !tache.urgent } : tache)));
  };

  const handleCategoryChange = (tacheId, categoryId) => {
    const existingRelation = relations.find(rel => rel.tache === tacheId);
    if (existingRelation) {
      setRelations(relations.map(rel => rel.tache === tacheId ? { ...rel, categorie: categoryId } : rel));
    } else {
      setRelations([...relations, { tache: tacheId, categorie: categoryId }]);
    }
  };

  const handleDateChange = (tacheId, newDate) => {
    const [year, month, day] = newDate.split("-");
    const formattedDate = `${day}/${month}/${year}`;
    setTodos(todos.map((tache) => (tache.id === tacheId ? { ...tache, date_echeance: formattedDate } : tache)));
  };

  const filteredTodos = filter === "All" ? todos : todos.filter(tache => tache.etat === filter);

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "date_creation") return new Date(a.date_creation) - new Date(b.date_creation);
    if (sortBy === "date_echeance") return new Date(a.date_echeance) - new Date(b.date_echeance);
    if (sortBy === "nom") return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    if (sortBy === "urgent") return (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0);
    return 0;
  });

  const filteredAndSortedCategories = categories.map((category) => {
    const relatedTodos = relations
      .filter((relation) => relation.categorie === category.id)
      .map((relation) => todos.find((tache) => tache.id === relation.tache))
      .filter(Boolean);

    return { category, sortedRelatedTodos: relatedTodos };
  });

  return (
    <main>

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
            <label>Trier par: </label>
            <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
              <option value="date_echeance">Date d'échéance</option>
              <option value="date_creation">Date de création</option>
              <option value="nom">Nom</option>
              <option value="urgent">Urgence</option>
            </select>
          </div>
        </div>

        <button className="toggle-view-btn" onClick={() => setViewMode(viewMode === "Tache" ? "Categorie" : "Tache")}>
          Basculer en mode {viewMode === "Tache" ? "Catégorie" : "Tâche"}
        </button>
      </div>

      <h2>Liste des tâches</h2>

      {viewMode === "Tache" ? (
        <ul>
          {sortedTodos.map((tache) => {
            const relatedCategory = relations.find((rel) => rel.tache === tache.id);

            return (
              <li key={tache.id} className={`todo-item ${tache.etat.toLowerCase().replace(/ /g, "")} ${tache.urgent ? "urgent" : ""}`}>
              <div className="todo-item-header">
                <strong className={ETAT_TERMINE.some((etat) => etat.name === tache.etat) ? "strikethrough" : ""}>{tache.title}</strong>
                <div className="todo-item-actions">
                  <select value={tache.etat} onChange={(e) => handleEtatChange(tache.id, e.target.value)}>
                    {Object.values(ETATS).map((etat) => (
                      <option key={etat.name} value={etat.name}>{etat.name}</option>
                    ))}
                  </select>
                  <label>
                    Urgent:
                    <input type="checkbox" checked={tache.urgent} onChange={() => handleUrgentChange(tache.id)} />
                  </label>
                  <button className="action-btn expand-btn" onClick={() => toggleTodoExpand(tache.id)}>
                    {expandedTodoId === tache.id ? "▲" : "▼"}
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDeleteTodo(tache.id)}>🗑️</button>
                </div>
              </div>
              <div className="todo-item-details">
                <p>Date d'échéance: </p>
                <input 
                    type="date" 
                    value={tache.date_echeance.split("/").reverse().join("-")} 
                    onChange={(e) => handleDateChange(tache.id, e.target.value)} 
                  />
                {expandedTodoId === tache.id && (
                  <div className="task-details">
                    <p>{tache.description || "Aucune description disponible"}</p>
                    <p>Date de création: {tache.date_creation}</p>
                  </div>
                )}
              </div>
              <p>Assigner à une catégorie:</p>
              <div className="category-actions">
              <select onChange={(e) => handleCategoryChange(tache.id, Number(e.target.value))} value={relatedCategory?.categorie || ""}>
                <option value="">Aucune</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.title}</option>
                ))}
              </select>
            </div>
            </li>
            )
        })}
        </ul>
      ) : (
        <ul className="category-list">
          {filteredAndSortedCategories.length > 0 ? (
            filteredAndSortedCategories.map(({ category, sortedRelatedTodos }) => (
              <li key={category.id} style={{ backgroundColor: category.color || "#e0e0e0" }}>
              <strong>{category.title}</strong>
              <button className="action-btn delete-btn" onClick={() => handleDeleteCategory(category.id)}>🗑️</button>
            
              <div className="task-container">
                {sortedRelatedTodos.length > 0 ? (
                   sortedRelatedTodos.map((tache) => (
                    <div
                      key={tache.id}
                      className={`todo-item ${
                        tache.etat.toLowerCase().replace(/ /g, "")
                      } ${tache.urgent ? "urgent" : ""}`}
                    >
                      <div className="todo-item-header">
                        <strong
                          className={
                            ETAT_TERMINE.some((etat) => etat.name === tache.etat)
                              ? "strikethrough"
                              : ""
                          }
                        >
                          {tache.title}
                        </strong>
                        <div className="todo-item-actions">
                          <button
                            className="action-btn expand-btn"
                            onClick={() => toggleTodoExpand(tache.id)}
                          >
                            {expandedTodoId === tache.id ? "▲" : "▼"}
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteTodo(tache.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="todo-item-details">
                        <p>Date d'échéance: {tache.date_echeance}</p>
                        {expandedTodoId === tache.id && (
                          <div className="task-details">
                            <p>{tache.description || "Aucune description"}</p>
                            <p>Date de création: {tache.date_creation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Aucune tâche.</p>
                )}
              </div>
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