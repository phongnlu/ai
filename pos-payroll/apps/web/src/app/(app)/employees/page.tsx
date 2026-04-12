const employees = [
  { id: 1, name: 'Jane Doe',     email: 'jane.doe@example.com',     position: 'Software Engineer', department: 'Engineering', type: 'Full-time', status: 'active' },
  { id: 2, name: 'Marcus Lee',   email: 'marcus.lee@example.com',   position: 'Support Specialist', department: 'Support',     type: 'Part-time', status: 'active' },
  { id: 3, name: 'Sarah Kim',    email: 'sarah.kim@example.com',    position: 'Product Manager',   department: 'Product',     type: 'Full-time', status: 'active' },
  { id: 4, name: 'Tom Rivera',   email: 'tom.rivera@example.com',   position: 'Designer',          department: 'Design',      type: 'Full-time', status: 'inactive' },
  { id: 5, name: 'Amy Chen',     email: 'amy.chen@example.com',     position: 'Data Analyst',      department: 'Engineering', type: 'Contractor', status: 'active' },
];

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

const statusBadge: Record<string, { color: string; bg: string }> = {
  active:   { color: 'var(--green)',   bg: 'var(--green-light)' },
  inactive: { color: 'var(--gray-500)', bg: 'var(--gray-100)' },
};

const typeBadge: Record<string, { color: string; bg: string }> = {
  'Full-time':  { color: 'var(--primary)', bg: 'var(--primary-light)' },
  'Part-time':  { color: 'var(--yellow)',  bg: 'var(--yellow-light)' },
  'Contractor': { color: 'var(--blue)',    bg: 'var(--blue-light)' },
};

export default function EmployeesPage() {
  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>Employees</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 13.5, marginTop: 2 }}>{employees.length} total employees</p>
        </div>
        <button style={{
          background: 'var(--primary)', color: '#fff', border: 'none',
          borderRadius: 7, padding: '8px 16px', fontSize: 13.5, fontWeight: 500,
          cursor: 'pointer',
        }}>
          + Add Employee
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Search employees..."
          style={{
            width: 280, padding: '7px 12px', borderRadius: 7,
            border: '1px solid var(--gray-200)', fontSize: 13.5,
            outline: 'none', background: '#fff',
          }}
        />
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', borderRadius: 'var(--radius)',
        border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--gray-100)', background: 'var(--gray-50)' }}>
              {['Employee', 'Position', 'Type', 'Status', ''].map((h) => (
                <th key={h} style={{
                  padding: '10px 16px', textAlign: 'left',
                  fontSize: 11.5, fontWeight: 600, color: 'var(--gray-500)',
                  textTransform: 'uppercase', letterSpacing: .4,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <tr key={emp.id} style={{ borderBottom: i < employees.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--primary-light)', color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11.5, fontWeight: 700, flexShrink: 0,
                    }}>{initials(emp.name)}</div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13.5, color: 'var(--gray-900)' }}>{emp.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: 13.5, color: 'var(--gray-700)' }}>{emp.position}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{emp.department}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    fontSize: 12, fontWeight: 500, padding: '3px 9px', borderRadius: 20,
                    color: typeBadge[emp.type]?.color, background: typeBadge[emp.type]?.bg,
                  }}>{emp.type}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    fontSize: 12, fontWeight: 500, padding: '3px 9px', borderRadius: 20,
                    color: statusBadge[emp.status]?.color, background: statusBadge[emp.status]?.bg,
                  }}>{emp.status}</span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button style={{
                    fontSize: 12.5, padding: '4px 10px', borderRadius: 6,
                    border: '1px solid var(--gray-200)', background: '#fff',
                    color: 'var(--gray-700)', cursor: 'pointer',
                  }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
