const TicketModal = ({ ticket, onClose }) => {
  if (!ticket) return null;

  return (
    <div className="ticket-overlay">
      <div className="ticket-modal">
        <h2 className="ticket-header">🅿️ Parking Receipt</h2>
        <div className="ticket-body">
          <p><strong>Plate:</strong> {ticket.plate}</p>
          <p><strong>Vehicle Type:</strong> {ticket.vehicleType}</p>
          <p><strong>Time In:</strong> {new Date(ticket.timeIn).toISOString()}</p>
          <p><strong>Time Out:</strong> {new Date(ticket.timeOut).toISOString()}</p>
          <p><strong>Duration:</strong> {ticket.duration} hour(s)</p>
          <p><strong>Amount:</strong> <span className="amount">${ticket.amount}</span></p>
        </div>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TicketModal;
