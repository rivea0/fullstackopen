const Person = ({ person, handleDeletePerson }) => {
  return (
    <p>
      {person.name} {person.number} &nbsp;
      <button onClick={handleDeletePerson}>delete</button>
    </p>
  );
}

export default Person;
