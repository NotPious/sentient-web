import React, { useState } from 'react';

export default function TourWidget({ dates }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDates = dates.filter(show => 
    show.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    show.venue?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-surface p-6 rounded-lg border border-accent/20">
      <input 
        type="text" 
        placeholder="Filter by city or venue..." 
        className="w-full bg-background border border-accent/40 rounded px-4 py-2 mb-4 text-foreground text-sm placeholder:text-zinc-500 placeholder:text-sm focus:outline-none focus:border-primary transition-colors"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="divide-y divide-accent/10">
        {filteredDates.length > 0 ? (
          filteredDates.map((show, idx) => (
            <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-primary font-mono text-sm">{show.date}</p>
                <h3 className="text-xl font-bold">{show.venue}</h3>
                <p className="text-sm text-zinc-400">{show.city}</p>
              </div>
              <a 
                href={show.ticketLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block text-center bg-primary hover:bg-accent text-foreground font-bold tracking-wide uppercase text-xs px-6 py-3 rounded transition-colors w-full sm:w-auto min-w-35"
              >
                Tickets
              </a>
            </div>
          ))
        ) : (
          <p className="text-zinc-500 py-4 text-center">No upcoming dates scheduled.</p>
        )}
      </div>
    </div>
  );
}