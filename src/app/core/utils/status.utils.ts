export function getStatusName(status: number): string {
  const statuses = [
    'Initiated',
    'Payment Pending',
    'Confirmed',
    'RAC',
    'Waitlisted',
    'Cancelled',
    'Completed'
  ];
  return statuses[status] || 'Unknown';
}
