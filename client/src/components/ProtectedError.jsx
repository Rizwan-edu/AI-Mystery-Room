import React from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

export default function ProtectedError({
  title = 'Investigation File Inaccessible',
  message = 'An unexpected anomaly occurred while retrieving case documents.',
  onRetry,
}) {
  return (
    <div className="min-h-[55vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#10121a] border border-red-500/30 rounded-2xl p-8 shadow-[0_0_35px_rgba(239,68,68,0.15)]">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5 text-red-400">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-wide mb-2">{title}</h3>
        <p className="text-sm text-neutral-400 leading-relaxed mb-6">{message}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onRetry && (
            <Button variant="secondary" size="md" onClick={onRetry} icon={RotateCcw}>
              Retry Connection
            </Button>
          )}
          <Link to="/">
            <Button variant="outline" size="md" icon={Home}>
              Return to Bureau
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
