export default function Badge({ status }) {
  const map = {
    Pending: 'badge-pending',
    Approved: 'badge-approved',
    Rejected: 'badge-rejected',
    Completed: 'badge-approved',
    Active: 'badge-approved',
  };
  return <span className={map[status] || 'badge-pending'}>{status}</span>;
}
