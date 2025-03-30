import React, { useState } from "react";
import { useTodos } from "../Context/TodosContext";
import { useCategories } from "../Context/CategoriesContext";
import { useRelations } from "../Context/RelationsContext";
import styles from "./Dataloader.module.css";

const DataLoader = ({ onDataLoaded }) => {
  const { setTodos } = useTodos();
  const { setCategories } = useCategories();
  const { setRelations } = useRelations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    setLoading(true);
    setError(null);

    const file = event.target.files[0];

    if (!file) {
      setLoading(false);
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);

          if (jsonData.taches && jsonData.categories && jsonData.relations) {
            setTodos(jsonData.taches);
            setCategories(jsonData.categories);
            setRelations(jsonData.relations);
            onDataLoaded();
          } else {
            setError(
              "Format de fichier JSON invalide. Doit contenir les propriétés 'taches', 'categories' et 'relations'."
            );
          }
        } catch (parseError) {
          setError("Erreur lors de l'analyse du fichier JSON.");
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError("Erreur lors de la lecture du fichier.");
        setLoading(false);
      };

      reader.readAsText(file);
    } catch (err) {
      setError("Une erreur inattendue est survenue.");
      setLoading(false);
    }
  };

  const loadDefaultData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await import("../../data/todos.json");

      if (data.default.taches && data.default.categories && data.default.relations) {
        setTodos(data.default.taches);
        setCategories(data.default.categories);
        setRelations(data.default.relations);
        onDataLoaded();
      } else {
        setError("Le fichier JSON par défaut est invalide.");
      }
    } catch (err) {
      setError("Erreur lors du chargement des données par défaut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.welcomeTitle}>Bienvenue dans votre gestionnaire de tâches</h1>
      <h2 className={styles.title}>Choisir la source de données</h2>
      <label htmlFor="fileInput" className={styles.fileInputLabel}>
        Sélectionner un fichier
      </label>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        disabled={loading}
        id="fileInput"
        className={styles.fileInput}
      />
      <button onClick={loadDefaultData} disabled={loading} className={styles.button}>
        Charger les données par défaut
      </button>

      {loading && <p>Chargement...</p>}
      {error && <p className={styles.error}>Erreur: {error}</p>}
    </div>
  );
};

export default DataLoader;