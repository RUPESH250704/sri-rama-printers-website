import React, { useState, useEffect } from 'react';

interface Employee {
  _id: string;
  name: string;
}

const Attendance: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '' });
  const [reportFromDate, setReportFromDate] = useState('');
  const [reportToDate, setReportToDate] = useState('');
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchAttendanceForDate();
  }, [selectedDate, employees]);

  useEffect(() => {
    if (reportFromDate && reportToDate) {
      fetchAttendanceReport();
    }
  }, [reportFromDate, reportToDate]);

  const fetchAttendanceReport = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/attendance/attendance-reports?startDate=${reportFromDate}&endDate=${reportToDate}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance report:', error);
    }
  };

  const calculateStats = () => {
    const stats: { [key: string]: { present: number; absent: number; total: number } } = {};
    
    employees.forEach(emp => {
      stats[emp._id] = { present: 0, absent: 0, total: 0 };
    });

    attendanceData.forEach(attendance => {
      attendance.attendanceRecords.forEach((record: any) => {
        if (stats[record.employee._id]) {
          stats[record.employee._id].total++;
          if (record.present) {
            stats[record.employee._id].present++;
          } else {
            stats[record.employee._id].absent++;
          }
        }
      });
    });

    return stats;
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/attendance/employees', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setEmployees(data);
      
      const initialAttendance: { [key: string]: boolean } = {};
      data.forEach((emp: Employee) => {
        initialAttendance[emp._id] = false;
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchAttendanceForDate = async () => {
    if (employees.length === 0) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/attendance/attendance/${selectedDate}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      
      if (data && data.attendanceRecords) {
        const attendanceMap: { [key: string]: boolean } = {};
        employees.forEach(emp => {
          const record = data.attendanceRecords.find((r: any) => r.employee._id === emp._id);
          attendanceMap[emp._id] = record ? record.present : false;
        });
        setAttendance(attendanceMap);
      } else {
        const initialAttendance: { [key: string]: boolean } = {};
        employees.forEach(emp => {
          initialAttendance[emp._id] = false;
        });
        setAttendance(initialAttendance);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleCheckboxChange = (employeeId: string) => {
    setAttendance(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };

  const handleSubmitAttendance = async () => {
    try {
      const attendanceRecords = Object.keys(attendance).map(employeeId => ({
        employee: employeeId,
        present: attendance[employeeId]
      }));

      const response = await fetch('http://localhost:5000/api/attendance/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          date: selectedDate,
          attendanceRecords
        })
      });

      if (response.ok) {
        alert('Attendance submitted successfully!');
      } else {
        alert('Failed to submit attendance');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Failed to submit attendance');
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/attendance/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newEmployee)
      });

      if (response.ok) {
        alert('Employee added successfully!');
        setNewEmployee({ name: '' });
        setShowAddEmployee(false);
        fetchEmployees();
      } else {
        alert('Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee');
    }
  };

  const handleDeleteEmployee = async (employeeId: string, employeeName: string) => {
    if (window.confirm(`Are you sure you want to remove ${employeeName}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/attendance/employees/${employeeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          alert('Employee removed successfully!');
          fetchEmployees();
        } else {
          alert('Failed to remove employee');
        }
      } catch (error) {
        console.error('Error removing employee:', error);
        alert('Failed to remove employee');
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        Employee Attendance
      </h1>

      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontWeight: 'bold', marginRight: '1rem' }}>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <span style={{ marginLeft: '1rem', color: '#666' }}>({formatDate(selectedDate)})</span>
          </div>
          <button
            onClick={() => setShowAddEmployee(!showAddEmployee)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: '1rem'
            }}
          >
            + Add Employee
          </button>
          <button
            onClick={() => setShowReport(!showReport)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📊 View Report
          </button>
        </div>

        {showReport && (
          <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #ddd' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Attendance Report Analysis</h3>
            <div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>From:</label>
                  <input
                    type="date"
                    value={reportFromDate}
                    onChange={(e) => setReportFromDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>To:</label>
                  <input
                    type="date"
                    value={reportToDate}
                    onChange={(e) => setReportToDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
              </div>

              {reportFromDate && reportToDate && (() => {
                const stats = calculateStats();
                return (
                  <div>
                    <h4 style={{ marginBottom: '1rem' }}>Employee Attendance Summary</h4>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {employees.map(employee => {
                        const empStats = stats[employee._id];
                        const attendanceRate = empStats.total > 0 ? ((empStats.present / empStats.total) * 100).toFixed(1) : '0';
                        
                        return (
                          <div key={employee._id} style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{employee.name}</div>
                                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                                  Present: {empStats.present} | Absent: {empStats.absent} | Total Days: {empStats.total}
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: parseFloat(attendanceRate) >= 80 ? '#28a745' : parseFloat(attendanceRate) >= 60 ? '#ffc107' : '#dc3545' }}>
                                  {attendanceRate}%
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>Attendance</div>
                              </div>
                            </div>
                            <div style={{ marginTop: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                              <div style={{ 
                                backgroundColor: parseFloat(attendanceRate) >= 80 ? '#28a745' : parseFloat(attendanceRate) >= 60 ? '#ffc107' : '#dc3545',
                                height: '100%',
                                width: `${attendanceRate}%`,
                                transition: 'width 0.3s ease'
                              }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {showAddEmployee && (
          <form onSubmit={handleAddEmployee} style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add New Employee</h3>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Employee Name *"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ name: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Save
              </button>
              <button type="button" onClick={() => setShowAddEmployee(false)} style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Mark Attendance</h3>
          {employees.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>No employees found. Add employees to mark attendance.</p>
          ) : (
            <div>
              {employees.map((employee) => (
                <div
                  key={employee._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    marginBottom: '0.5rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={attendance[employee._id] || false}
                    onChange={() => handleCheckboxChange(employee._id)}
                    style={{ width: '20px', height: '20px', marginRight: '1rem', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{employee.name}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: attendance[employee._id] ? 'green' : 'red', marginRight: '1rem' }}>
                    {attendance[employee._id] ? 'Present' : 'Absent'}
                  </div>
                  <button
                    onClick={() => handleDeleteEmployee(employee._id, employee.name)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmitAttendance}
          disabled={employees.length === 0}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: employees.length === 0 ? '#ccc' : 'black',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: employees.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
};

export default Attendance;
