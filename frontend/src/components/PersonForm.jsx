const PersonForm =({ 
	onSubmit, 
	name,
	onNameChange,
	phoneNumber,
	onPhoneNumberChange
}) => {
	return (
		<form onSubmit={onSubmit}>
			<div>
				Name: <input
					value={name}
					onChange={onNameChange}
				/>
			</div>
			<div>
				Number: <input 
					value={phoneNumber}
					onChange={onPhoneNumberChange}
				/>
			</div>
			<div>
				<button type="submit">Add</button>
			</div>
		</form>
	);
};

export default PersonForm;
