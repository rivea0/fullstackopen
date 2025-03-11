import { useEffect, useState } from 'react';
import personService from './services/persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filteredName, setFilteredName] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
      .catch(error => {
        alert("Couldn't get existing persons!");
      });
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
      return;
    }

    const cleanNewName = newName.trim();
    const cleanNewNumber = newNumber.trim();

    nameAlreadyExistsInServer(cleanNewName)
      .then(existingPerson => {
        if (askForConfirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
          updatePersonNumber(existingPerson, cleanNewNumber);
        } else {
          // The user cancelled the confirm window
          return;
        }
      })
      // If person does not exist, create new one
      .catch(error => {
        // If person is already deleted in one browser, it's not reflected in another browser's state.
        // So when they try to edit person that still shows up in UI, they essentially add a new person to server.
        // Update state to remove the already deleted person before showing the newly added person.
        setPersons(persons.filter(person => person.name !== cleanNewName));

        const newPerson = { name: cleanNewName, number: cleanNewNumber };
        personService
          .create(newPerson)
          .then(returnedPerson => {
              setPersons(prevPersons => prevPersons.concat(returnedPerson));
              setNewName('');
              setNewNumber('');
              setSuccessMessage(`Added ${returnedPerson.name}`);
              setTimeout(() => {
                setSuccessMessage(null);
              }, 5000);

          })
          .catch(error => {
            alert('Error: could not create person!');
          });
      })
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
          alert(`Person ${personToDelete.name} is already deleted from the server`);
          setPersons(persons.filter(person => person.id !== personToDelete.id));
        });
    }
  }

  const updatePersonNumber = (existingPerson, number) => {
    personService
    .update(existingPerson.id, { ...existingPerson, number: number })
    .then(updatedPerson => {
      // If person is already added in one browser, it's not reflected in another browser's state.
      // So when they try to add person with the same name, they will update the existing person.
      // Update state accordingly when the existing person wasn't shown in UI.
      if (!persons.find(person => person.id === updatedPerson.id)) {
        setPersons([...persons, updatedPerson]);
        setSuccessMessage(`Person ${existingPerson.name} successfully updated`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);

      } else {
        setPersons(persons.map(person => {
          if (person.id === updatedPerson.id) {
            return { ...person, number: number };
          } else {
            return { ...person };
          }
        }));
        setSuccessMessage(`Person ${existingPerson.name} successfully updated`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }
      setNewName('');
      setNewNumber('');
    })
    .catch(error => {
      alert(`Could not update ${existingPerson.name}`);
    });
  }

  const nameAlreadyExistsInServer = (name) => {
    const allPersons = personService.getAll();
    return allPersons.then(allPersons => allPersons.find(person => person.name.toLowerCase() === name.toLowerCase()));
  }

  const askForConfirm = text => window.confirm(text);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
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
