import { place, type Concert } from './content';

// iCalendar (RFC 5545) file for one concert, so visitors can add it to any calendar app.

const pad = (n: number) => String(n).padStart(2, '0');
const utc = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

/** Wall-clock time in Prague to a UTC instant; UTC keeps every calendar app in agreement. */
const pragueToUtc = (date: string, time: string) => {
  const guess = new Date(`${date}T${time}:00Z`);
  const zone =
    new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Prague', timeZoneName: 'longOffset' })
      .formatToParts(guess)
      .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';
  const m = /GMT([+-])(\d{2}):?(\d{2})?/.exec(zone);
  const offset = m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0)) : 0;
  return new Date(guess.getTime() - offset * 60_000);
};

const escape = (text: string) =>
  text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

const encoder = new TextEncoder();

/** At most 75 octets per line; continuation lines start with a space (which counts too). */
const fold = (line: string) => {
  const lines: string[] = [];
  let current = '';
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > (lines.length ? 74 : 75)) {
      lines.push(current);
      current = '';
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  lines.push(current);
  return lines.join('\r\n ');
};

export const buildIcs = (c: Concert, url: string, now: Date) => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Exhalace//Koncerty//CS',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${c.slug}@exhalace.cz`,
    `DTSTAMP:${utc(now)}`,
  ];
  if (c.time) {
    const start = pragueToUtc(c.date, c.time);
    let end = c.end ? pragueToUtc(c.date, c.end) : new Date(start.getTime() + 3 * 3_600_000);
    if (end <= start) end = new Date(end.getTime() + 24 * 3_600_000); // ends after midnight
    lines.push(`DTSTART:${utc(start)}`, `DTEND:${utc(end)}`);
  } else {
    const next = new Date(`${c.date}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    lines.push(
      `DTSTART;VALUE=DATE:${c.date.replaceAll('-', '')}`,
      `DTEND;VALUE=DATE:${next.toISOString().slice(0, 10).replaceAll('-', '')}`,
    );
  }
  const location = [c.venue, c.address, c.city].filter(Boolean).join(', ');
  const description = [c.info, c.tickets, url].filter(Boolean).join('\n\n');
  lines.push(
    `SUMMARY:${escape(`Exhalace — ${c.title ?? place(c)}`)}`,
    `LOCATION:${escape(location)}`,
    `DESCRIPTION:${escape(description)}`,
    `URL:${url}`,
  );
  if (c.status === 'cancelled') lines.push('STATUS:CANCELLED');
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return `${lines.map(fold).join('\r\n')}\r\n`;
};
