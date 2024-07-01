import axios from 'axios';

export const getEmployeeDetails = async (token) => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/employees/get_employee_details/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching employee details:", error);
        throw error;
    }
};