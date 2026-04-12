const payPeriods = [
  { id: 1, range: 'Jun 1 – Jun 15, 2024',  payDate: 'Jun 20, 2024', employees: 24, gross: '$96,800', net: '$84,320', status: 'draft' },
  { id: 2, range: 'May 16 – May 31, 2024', payDate: 'Jun 5, 2024',  employees: 23, gross: '$94,200', net: '$82,100', status: 'paid' },
  { id: 3, range: 'May 1 – May 15, 2024',  payDate: 'May 20, 2024', employees: 23, gross: '$94,200', net: '$81,950', status: 'paid' },
  { id: 4, range: 'Apr 16 – Apr 30, 2024', payDate: 'May 5, 2024',  employees: 22, gross: '$90,100', net: '$78,400', status: 'paid' },
  { id: 5, range: 'Apr 1 – Apr 15, 2024',  payDate: 'Apr 20, 2024', employees: 22, gross: '$90,100', net: '$78,200', status: 'paid' },
];

const statusStyle: Record<string, { color: string; bg: string; label: string }> = {
  draft:    { color: 'var(--yellow)',  bg: 'var(--yellow-light)', label: 'Draft' },
  approved: { color: 'var(--blue)',    bg: 'var(--blue-light)',   label: 'Approved' },
  paid:     { color: 'var(--green)',   bg: 'var(--green-light)',  label: 'Paid' },
};

export default function PayrollPage() {
  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>Payroll</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 13.5, marginTop: 2 }}>Manage pay periods and pay stubs</p>
        </div>
        <button style={{
          background: 'var(--primary)', color: '#fff', border: 'none',
          borderRadius: 7, padding: '8px 16px', fontSize: 13.5, fontWeight: 500,
          cursor: 'pointer',
        }}>
          + New Pay Period
        </button>
      </div>

      <div style={{
        background: '#fff', borderRadius: 'var(--radius)',
        border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--gray-100)', background: 'var(--gray-50)' }}>
              {['Pay Period', 'Pay Date', 'Employees', 'Gross Pay', 'Net Pay', 'Status', ''].map((h) => (
                <th key={h} style={{
                  padding: '10px 16px', textAlign: 'left',
                  fontSize: 11.5, fontWeight: 600, color: 'var(--gray-500)',
                  textTransform: 'uppercase', letterSpacing: .4,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payPeriods.map((p, i) => {
              const s = statusStyle[p.status];
              return (
                <tr key={p.id} style={{ borderBottom: i < payPeriods.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontSize: 13.5, fontWeight: 500, color: 'var(--gray-900)' }}>{p.range}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13.5, color: 'var(--gray-500)' }}>{p.payDate}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13.5, color: 'var(--gray-700)' }}>{p.employees}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13.5, color: 'var(--gray-700)' }}>{p.gross}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13.5, fontWeight: 600, color: 'var(--gray-900)' }}>{p.net}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: 12, fontWeight: 500, padding: '3px 9px', borderRadius: 20,
                      color: s?.color, background: s?.bg,
                    }}>{s?.label}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button style={{
                      fontSize: 12.5, padding: '4px 10px', borderRadius: 6,
                      border: '1px solid var(--gray-200)', background: '#fff',
                      color: 'var(--gray-700)', cursor: 'pointer',
                    }}>View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
