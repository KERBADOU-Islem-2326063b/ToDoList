import "./App.css";
import todos from "./todos.json";

export default function App() {
  const prenom = "Islem";
  const nom = "KERBADOU";

  return (
    <div className="App">
      <h1>Bienvenue {prenom} {nom}</h1>
      <h2>Liste des tâches : </h2>
      <ul>
        {todos.taches.map((tache) => (
          <li key={tache.id}>
            {tache.nom} {tache.fait ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
}
