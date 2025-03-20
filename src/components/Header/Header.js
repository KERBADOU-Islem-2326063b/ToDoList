import "./Header.css";

function Header({ todos = [] }) {
  const taches = todos;

  const doneCount = taches.filter(t => t.etat === "Reussi").length;
  const newCount = taches.filter(t => t.etat === "Nouveau").length;
  const waitingCount = taches.filter(t => t.etat === "En attente").length;
  const totalCount = taches.length;
  const unfinishedCount = totalCount - doneCount;

  return (
    <header className="header">
      <div className="header-left">
        <p>Total Taches: {totalCount} / Non finies: {unfinishedCount}</p>
      </div>
      <p>|</p>
      <div className="header-right">
        <ul>
          <li>✅ Reussi: {doneCount}</li>
          <li>🆕 Nouveau: {newCount}</li>
          <li>⏳ En attente: {waitingCount}</li>
        </ul>
      </div>
    </header>
  );
}

export default Header;