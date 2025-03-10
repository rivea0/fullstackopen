import { useEffect, useState } from 'react';
import personService from './services/persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filteredName, setFilteredName] = useState('');

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        alert("Couldn't get existing persons!");
      })
  }, []);

  const handleNewNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilteredNameChange = (event) => {
    setFilteredName(event.target.value);
  }

  const addPerson = (event) => {
    event.preventDefault();
    if (newName === '' || newNumber === '') {
      alert('Name or number cannot be empty!');
      setNewName('');
      setNewNumber('');
      return;
    }
    if (nameAlreadyExists(newName)) {
      if (askForConfirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        updatePersonNumber();
      } else {
        // The user cancelled the confirm window
        return;
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
      personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        alert('Error: could not create person!');
      });
    }
  }

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id);
    if (askForConfirm(`Delete ${personToDelete.name}?`)) {
      personService
        .deletePerson(id)
        .then(deletedPerson => {
          setPersons(persons.filter(person => person.id !== deletedPerson.id));
        })
        .catch(error => {
          alert('Error: could not delete person');
        });
    }
  }

  const updatePersonNumber = () => {
    const foundPerson = getPersonByName(newName);
    foundPerson
    .then(person => {
      personService
        .update(person.id, { ...person, number: newNumber })
        .then(updatedPerson => {
          setPersons(persons.map(person => {
            if (person.id === updatedPerson.id) {
              return { ...person, number: newNumber };
            } else {
              return { ...person };
            }
          }));
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          alert('Error: could not update the number');
        });
    })
    .catch(error => {
      console.log('Error while finding person by name');
    });
  }

  const nameAlreadyExists = (name) => {
    return persons.some(person => {
      return person.name.toLowerCase() === name.toLowerCase();
    });
  }

  const getPersonByName = (name) => {
    // As each name is unique, if person by that name exists, the result will be a unique person object
    const data = personService.getAll();
    return data.then(allPersons => allPersons.find(person => person.name === name));
  }

  const askForConfirm = text => window.confirm(text);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        filteredName={filteredName}
        handleFilteredNameChange={handleFilteredNameChange}
      />
      <h3>Add a new person</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNewNameChange={handleNewNameChange}
        newNumber={newNumber}
        handleNewNumberChange={handleNewNumberChange}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        filteredName={filteredName}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default App;
