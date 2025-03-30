import React, { useState } from "react";
import { useTodos } from "../Context/TodosContext";
import { useCategories } from "../Context/CategoriesContext";
import { useRelations } from "../Context/RelationsContext";
import "./Footer.css";

const Footer = () => {
  const { todos, setTodos } = useTodos();
  const { categories, setCategories } = useCategories();
  const { relations, setRelations } = useRelations();
  const [newTask, setNewTask] = useState({ title: "", description: "", date_echeance: "", urgent: false, category: "" });
  const [newCategory, setNewCategory] = useState({ title: "", color: "" });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleAddTask = () => {
      if (!newTask.title || !newTask.date_echeance) return;
    
      const newTache = {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        date_creation: new Date().toLocaleDateString("fr-FR"),
        date_echeance: newTask.date_echeance.split("-").reverse().join("/"),
        etat: "Nouveau",
        urgent: newTask.urgent
      };
    
      setTodos([...todos, newTache]);

      if (newTask.category !== "") {
        const newRelation = {
          tache: newTache.id,
          categorie: Number(newTask.category)
        };
        setRelations([...relations, newRelation]);
      }
      
      setNewTask({ title: "", description: "", date_echeance: "", urgent: false, category: "" });
      setShowTaskModal(false);
    };
    

  const handleAddCategory = () => {
    if (!newCategory.title) return;
    const newCat = { id: Date.now(), title: newCategory.title, color: newCategory.color || "gray", actif: true };
    setCategories([...categories, newCat]);
    setNewCategory({ title: "", color: "" });
    setShowCategoryModal(false);
  };

  return (
    <footer className="footer">
      <button className="btn primary" onClick={() => setShowTaskModal(true)}>
        Créer une tâche
      </button>
      <button className="btn secondary" onClick={() => setShowCategoryModal(true)}>
        Créer une catégorie
      </button>

      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Créer une tâche</h3>
            <input type="text" placeholder="Titre" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
            <textarea placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}></textarea>
            <input type="date" value={newTask.date_echeance} onChange={(e) => setNewTask({ ...newTask, date_echeance: e.target.value })} />
            <label className="checkbox-label">
              Urgent
              <input type="checkbox" checked={newTask.urgent} onChange={() => setNewTask({ ...newTask, urgent: !newTask.urgent })} />
            </label>
            <select 
              value={newTask.category} 
              onChange={(e) => setNewTask({ 
                ...newTask, 
                category: e.target.value
              })}
            >
            <option value="">Aucune catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.title}</option>
            ))}
          </select>
            <button className="btn primary" onClick={handleAddTask}>Ajouter Tâche</button>
            <button className="btn danger" onClick={() => setShowTaskModal(false)}>Fermer</button>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Créer une catégorie</h3>
            <input type="text" placeholder="Titre de la catégorie" value={newCategory.title} onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })} />
            <input type="color" value={newCategory.color} onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })} />
            <button className="btn primary" onClick={handleAddCategory}>Ajouter Catégorie</button>
            <button className="btn danger" onClick={() => setShowCategoryModal(false)}>Fermer</button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;