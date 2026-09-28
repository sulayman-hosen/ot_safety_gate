const paths = {
  shield: ['M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z', 'm8 12 3 3 5-6'],
  grid: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M3 14h7v7H3z', 'M14 14h7v7h-7z'],
  pulse: ['M2 12h5l3-8 4 16 3-8h5'],
  clipboard: ['M9 5H5v16h14V5h-4', 'M9 3h6v4H9z', 'm8 14 3 3 5-6'],
  clock: ['M12 8v5l3 2'],
  document: ['M14 2H5v20h14V7z', 'M14 2v6h5', 'M8 12h8', 'M8 16h6'],
  lock: ['M6 10h12v11H6z', 'M8 10V6a4 4 0 0 1 8 0v4', 'M12 14v3'],
  book: ['M12 5C8 2 4 3 2 4v16c3-2 7-2 10 0 3-2 7-2 10 0V4c-3-1-7-2-10 1Z', 'M12 5v15'],
  arrow: ['M5 12h14', 'm13 6 6 6-6 6'],
  external: ['M14 3h7v7', 'm21 3-12 12', 'M10 3H3v18h18v-7'],
  check: ['m5 12 4 4L19 6'],
  close: ['m6 6 12 12', 'M18 6 6 18'],
  warning: ['m12 3 10 18H2Z', 'M12 9v5', 'M12 17h.01'],
  info: ['M12 11v6', 'M12 7h.01'],
  refresh: ['M20 7a9 9 0 1 0 1 9', 'M20 2v6h-6'],
  download: ['M12 3v12', 'm7 10 5 5 5-5', 'M4 16v5h16v-5'],
  exit: ['M9 3H3v18h6', 'M9 12h12', 'm16 7 5 5-5 5'],
  flask: ['M9 3h6', 'M10 3v7L4 21h16l-6-11V3', 'M7 16h10'],
  stethoscope: ['M5 3v5a5 5 0 0 0 10 0V3', 'M3 3h4', 'M13 3h4', 'M10 13v3a5 5 0 0 0 10 0v-3'],
  fingerprint: ['M4 12a8 8 0 0 1 16 0', 'M7 13v-1a5 5 0 0 1 10 0v3', 'M10 19v-7a2 2 0 0 1 4 0v7', 'M4 16v3', 'M20 16v3'],
  menu: ['M3 6h18', 'M3 12h18', 'M3 18h18'],
  chevron: ['m9 5 7 7-7 7'],
  user: ['M4 21v-2a8 8 0 0 1 16 0v2'],
  heart: ['M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 8 15 8 15s13-10 8-15Z'],
  sun: ['M12 2v2', 'M12 20v2', 'm4.93 4.93 1.41 1.41', 'm17.66 17.66 1.41 1.41', 'M2 12h2', 'M20 12h2', 'm6.34 17.66-1.41 1.41', 'm19.07 4.93-1.41 1.41'],
  moon: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
  globe: ['M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z', 'M2 12h20', 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z'],
  search: ['m21 21-4.35-4.35'],
  sparkles: ['m12 3 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z']
};

export default function ClinicalIcon({ name = 'shield', size = 20, className = '', ...props }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} {...props}>
    {['clock', 'info'].includes(name) && <circle cx="12" cy="12" r="9" />}
    {name === 'user' && <circle cx="12" cy="7" r="4" />}
    {name === 'stethoscope' && <circle cx="20" cy="11" r="2" />}
    {name === 'sun' && <circle cx="12" cy="12" r="4" />}
    {name === 'search' && <circle cx="11" cy="11" r="7" />}
    {(paths[name] || paths.shield).map((path, index) => <path key={index} d={path} />)}
  </svg>;
}
