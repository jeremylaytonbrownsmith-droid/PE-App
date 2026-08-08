import { Printer } from 'lucide-react';
import { Button } from './Button';

export function PrintButton() {
  return (
    <Button variant="secondary" onClick={() => window.print()}>
      <Printer size={16} />
      Print / Save PDF
    </Button>
  );
}
