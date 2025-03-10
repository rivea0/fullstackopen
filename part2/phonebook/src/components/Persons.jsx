import Person from './Person';

const Persons = ({ persons, filteredName, handleDelete }) => {
  return (
    <div>
      {persons.map(person => {
        // When filteredName is an empty string, all persons will be displayed by default
        // as every string is considered to start with an empty string
        if (person.name.toLowerCase().startsWith(filteredName.toLowerCase())) {
          return (
            <Person
              key={person.name}
              person={person}
              handleDeletePerson={() => handleDelete(person.id)}
            />
          );
        }
      })}
    </div>
  );
}

export default Persons;
