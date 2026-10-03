const Notification = ({ message, type }) => {
	if (message === null) {
		return null;
	}

	return (
		<div className={`message-notifications ${type}`}>
			{message}
		</div>
	);
};

export default Notification;
