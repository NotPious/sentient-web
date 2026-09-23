import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
     <div className="bg-surface p-6 rounded-lg border border-accent/20">
      {status === 'success' ? (
        <p className="text-emerald-400 font-mono text-sm py-2 text-center sm:text-left">
          Thanks for subscribing!
        </p>
      ) : (
        <div className="divide-y divide-accent/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            
            <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-4 sm:items-center">
              {/* 
                PLACEHOLDER FIX: Explicitly uniform tracking anchors using placeholder: prefix 
                so type="email" and type="text" render identically.
              */}
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                disabled={status === 'loading'}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background border border-accent/40 rounded px-4 py-2 text-foreground text-sm placeholder:text-zinc-500 placeholder:text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
              
              <button
                type="submit"
                disabled={status === 'loading'}
                className="text-center bg-primary hover:bg-accent text-foreground font-bold tracking-wide uppercase text-xs px-6 py-3 rounded transition-colors disabled:opacity-50 whitespace-nowrap w-full sm:w-auto min-w-35"
              >
                {status === 'loading' ? 'Saving...' : 'Subscribe'}
              </button>
            </form>
          </div>

          {/* 
            Nesting this element under the divide-y line matches how the show location text 
            sits inside the card architecture, giving it the exact same spatial layout.
          */}
          <div className="pt-4">
            <p className="text-sm text-zinc-400">
              Receive tour announcements and official updates.
            </p>
          </div>
        </div>
      )}
      
      {status === 'error' && (
        <p className="text-rose-400 font-mono text-xs mt-3 text-center sm:text-left">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}