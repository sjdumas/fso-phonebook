const Person = ({ person, onDelete }) => {
	return (
		<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
			{person.name} {person.number}
			<button onClick={() => onDelete(person.id, person.name)}>Delete</button>
		</div>	
	)
};

export default Person;
