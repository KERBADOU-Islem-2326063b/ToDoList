import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import "./Header.css";
import { useTodos } from "../Context/TodosContext";
import { ETATS, ETAT_TERMINE } from "../Enums/Etats";

function Header() {
  const { todos } = useTodos();
  const taches = todos;
  const totalCount = taches.length;

  const doneCount = taches.filter(t => t.etat === ETATS.REUSSI.name).length;
  const unfinishedCount = totalCount - doneCount;

  const newCount = taches.filter(t => t.etat === ETATS.NOUVEAU.name).length;
  const waitingCount = taches.filter(t => t.etat === ETATS.EN_ATTENTE.name).length;

  const data = [
    { name: ETATS.NOUVEAU.name.toLowerCase(), value: newCount },
    { name: ETATS.EN_COURS.name.toLowerCase(), value: totalCount - newCount - doneCount - waitingCount },
    { name: ETATS.REUSSI.name.toLowerCase(), value: doneCount },
    { name: ETATS.EN_ATTENTE.name.toLowerCase(), value: waitingCount },
    { name: ETATS.ABANDONNE.name.toLowerCase(), value: totalCount - newCount - doneCount - waitingCount }
  ];

  return (
    <header className="header">
      <div className="header-left">
        <p>Total Taches: {totalCount} / Non finies: {unfinishedCount}</p>
      </div>
      <div className="header-right">
        <PieChart width={220} height={220}>
          <Pie data={data} dataKey="value" outerRadius={80}>
           {data.map((entry, index) => {
              const state = Object.values(ETATS).find(state => state.name.toLowerCase() === entry.name);
              return state ? <Cell key={`cell-${index}`} fill={state.color} /> : null;
            })}
          </Pie>
          <Tooltip />
          <Legend 
            align="center"
            verticalAlign="bottom"
            iconSize={10}
            layout="vertical"
            wrapperStyle={{
              paddingTop: '20px',
              marginTop: '20px',
            }}
          />
        </PieChart>
      </div>
    </header>
  );
}

export default Header;