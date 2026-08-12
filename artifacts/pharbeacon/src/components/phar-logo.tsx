import { ArrowUpRight } from 'lucide-react';

export function PharLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="phar-brand" data-testid="brand-pharbeacon">
      <span className="beacon-mark" aria-hidden="true"><ArrowUpRight size={18} strokeWidth={1.5} /></span>
      {!compact && <span className="phar-brand-name">PHARBEACON</span>}
    </div>
  );
}