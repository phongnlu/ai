import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const stats = [
  { label: 'Total Employees', value: '24', change: '+2 this month', color: 'var(--primary)', bg: 'var(--primary-light)' },
  { label: 'Active Employees', value: '21', change: '3 inactive', color: 'var(--green)', bg: 'var(--green-light)' },
  { label: 'Current Pay Period', value: 'Jun 1–15', change: 'Ends in 4 days', color: 'var(--yellow)', bg: 'var(--yellow-light)' },
  { label: 'Net Payroll', value: '$84,320', change: 'This period', color: 'var(--blue)', bg: 'var(--blue-light)' },
];

const recentActivity = [
  { action: 'Pay stub generated', name: 'Jane Doe', time: '2 hours ago', status: 'paid' },
  { action: 'Employee added', name: 'Marcus Lee', time: '1 day ago', status: 'active' },
  { action: 'Pay period approved', name: 'May 16–31', time: '3 days ago', status: 'approved' },
  { action: 'Pay stub generated', name: 'Sarah Kim', time: '3 days ago', status: 'paid' },
  { action: 'Employee updated', name: 'Tom Rivera', time: '5 days ago', status: 'active' },
];

const statusStyle: Record<string, { color: string; bg: string }> = {
  paid:     { color: 'var(--green)', bg: 'var(--green-light)' },
  active:   { color: 'var(--primary)', bg: 'var(--primary-light)' },
  approved: { color: 'var(--yellow)', bg: 'var(--yellow-light)' },
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const firstName = session?.user?.name?.split(' ')[0] ?? 'there';

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>
          Good morning, {firstName}
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 13.5, marginTop: 2 }}>
          Here&apos;s what&apos;s happening with your payroll today.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: '#fff', borderRadius: 'var(--radius)',
            border: '1px solid var(--gray-200)', padding: '16px 18px',
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{
              display: 'inline-flex', padding: '5px 8px', borderRadius: 6,
              background: s.bg, marginBottom: 10,
            }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: s.color, textTransform: 'uppercase', letterSpacing: .4 }}>
                {s.label}
              </span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div style={{
        background: '#fff', borderRadius: 'var(--radius)',
        border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow)',
      }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Recent Activity</span>
        </div>
        <div>
          {recentActivity.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 18px',
              borderBottom: i < recentActivity.length - 1 ? '1px solid var(--gray-100)' : 'none',
            }}>
              <div>
                <span style={{ fontSize: 13.5, color: 'var(--gray-700)', fontWeight: 500 }}>{item.action}</span>
                <span style={{ fontSize: 13, color: 'var(--gray-500)', marginLeft: 6 }}>— {item.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontSize: 11.5, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
                  color: statusStyle[item.status]?.color,
                  background: statusStyle[item.status]?.bg,
                }}>
                  {item.status}
                </span>
                <span style={{ fontSize: 12, color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
