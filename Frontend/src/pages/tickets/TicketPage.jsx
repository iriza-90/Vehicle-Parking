import { useLocation, useNavigate } from 'react-router-dom'
import TicketModal from '../tickets/TicketModal' 

const TicketPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const ticket = state?.ticket

  if (!ticket) {
    // Handle direct access to /ticket without data
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">No ticket data available</h2>
        <button className="btn-primary mt-4" onClick={() => navigate('/')}>
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <TicketModal ticket={ticket} onClose={() => navigate('/')} />
    </div>
  )
}

export default TicketPage
