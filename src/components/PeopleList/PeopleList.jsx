import React from "react";
import "./PeopleList.scss";

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">◎</div>
      <h3>El sorteo empieza aquí</h3>
      <p>Cuando inscribas al primer jugador, su personaje y número aparecerán aquí.</p>
    </div>
  );
}

function PersonRow({ person }) {
  return (
    <article className="person-row">
      <span className="person-name">{person.name}</span>
      <span className="person-number">{String(person.number).padStart(2, "0")}</span>
    </article>
  );
}

function PeopleList({ people }) {
  if (people.length === 0) return <EmptyState />;

  return (
    <div className="people-list">
      {[...people]
        .sort((a, b) => a.number - b.number)
        .map((person) => <PersonRow key={person.number} person={person} />)}
    </div>
  );
}

export default PeopleList;
