import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import "./Header.css";
import { useTodos } from "../Context/TodosContext";
import { ETATS } from "../Enums/Etats";

function Header() {
  const { todos } = useTodos();
  const totalCount = todos.length;

  const doneCount = todos.filter(t => t.etat === ETATS.REUSSI.name).length;
  const newCount = todos.filter(t => t.etat === ETATS.NOUVEAU.name).length;
  const waitingCount = todos.filter(t => t.etat === ETATS.EN_ATTENTE.name).length;
  const inProgressCount = todos.filter(t => t.etat === ETATS.EN_COURS.name).length;
  const abandonedCount = todos.filter(t => t.etat === ETATS.ABANDONNE.name).length;

  const unfinishedCount = totalCount - doneCount;

  const data = [
    { name: ETATS.NOUVEAU.name.toLowerCase(), value: newCount },
    { name: ETATS.EN_COURS.name.toLowerCase(), value: inProgressCount },
    { name: ETATS.REUSSI.name.toLowerCase(), value: doneCount },
    { name: ETATS.EN_ATTENTE.name.toLowerCase(), value: waitingCount },
    { name: ETATS.ABANDONNE.name.toLowerCase(), value: abandonedCount }
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
