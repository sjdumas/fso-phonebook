import { useState, useEffect } from "react";
import personService from "./services/persons";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Notification from "./components/Notification";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [newName, setNewName] = useState("");
	const [newPhoneNumber, setNewPhoneNumber] = useState("");
	const [successMessage, setSuccessMessage] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => {
		personService.getAll().then(initialPersons => {
			setPersons(initialPersons);
		});
	}, []);

	const showError = (message) => {
		setErrorMessage(message);
		setTimeout(() => setErrorMessage(null), 5000);
	};

	const addName = (event) => {
		event.preventDefault();

		const existingPerson = persons.find(
			(person) => person.name.toLowerCase() === newName.toLowerCase()
		);

		if (existingPerson) {
			if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
				const updatedPerson = { ...existingPerson, number: newPhoneNumber };

				personService.update(existingPerson.id, updatedPerson).then(returnedPerson => {
					setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson));
					setSuccessMessage(`Added ${newName}`)
					setTimeout(() => {
						setSuccessMessage(null)
					}, 5000)
					setNewName("");
					setNewPhoneNumber("");
				}).catch(error => {
					showError(`Information of ${newName} has already been removed from server`);
					setPersons(persons.filter(p => p.id !== existingPerson.id));
				});
			}
			return;
		};

		const nameObject = {
			name: newName,
			number: newPhoneNumber,
			id: persons.length + 1,
		};

		personService.create(nameObject)
			.then(returnedPerson => {
				setPersons(persons.concat(returnedPerson));
				setSuccessMessage(`Added ${newName}`);
				setTimeout(() => {
					setSuccessMessage(null);
				}, 5000);
				setNewName("");
				setNewPhoneNumber("");
			})
			.catch(error => {
				showError(error.response.data.error);
			});
	};

	const personsToShow = persons.filter(person =>
		person.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	}

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	}

	const handleNewPhoneNumber = (event) => {
		setNewPhoneNumber(event.target.value);
	};

	const handleDelete = (id, name) => {
		if (window.confirm(`Delete ${name}?`)) {
			personService.deletePerson(id).then(() => {
				setPersons(persons.filter(person => person.id !== id));
			});
		}
	};

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification 
				message={successMessage} 
				type="success" 
			/>
			<Notification 
				message={errorMessage} 
				type="error" 
			/>
			<Filter 
				value={searchTerm} 
				onChange={handleSearchChange} 
			/>
			<h3>Add a New</h3>
			<PersonForm 
				onSubmit={addName}
				name={newName}
				onNameChange={handleNameChange}
				phoneNumber={newPhoneNumber}
				onPhoneNumberChange={handleNewPhoneNumber}
			/>
			<h3>Numbers</h3>
			<Persons 
				persons={personsToShow} 
				onDelete={handleDelete}
			/>
		</div>
	);
};

export default App;
