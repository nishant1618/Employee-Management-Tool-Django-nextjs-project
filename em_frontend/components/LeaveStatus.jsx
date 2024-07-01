const LeaveStatus = ({ leaveStatus }) => {
    const handleStatusUpdate = async (leaveId, newStatus) => {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(
          `/api/leave/${leaveId}/`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Handle successful status update
        console.log('Leave status updated successfully');
      } catch (error) {
        console.error('Error updating leave status:', error);
      }
    };
  
    return (
      <div>
        <h2>Leave Status</h2>
        <ul>
          {leaveStatus.map((leave) => (
            <li key={leave.id}>
              <strong>{leave.leave_type}</strong>
              <br />
              {leave.start_date} - {leave.end_date}: {leave.status}
              {/* Render status update buttons for admins and managers */}
              {(userRole === 'admin' || userRole === 'manager') && (
                <>
                  <button onClick={() => handleStatusUpdate(leave.id, 'approved')}>
                    Approve
                  </button>
                  <button onClick={() => handleStatusUpdate(leave.id, 'rejected')}>
                    Reject
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  export default LeaveStatus;

