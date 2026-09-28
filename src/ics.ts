import { nextDay, type Concert } from './content';

// iCalendar (RFC 5545) file for one concert, so visitors can add it to any calendar app.

const pad = (n: number) => String(n).padStart(2, '0');
const utc = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

/** Prague's UTC offset in minutes at a given instant (+60 in winter, +120 in summer). */
const pragueOffset = (at: Date) => {
  const zone =
    new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Prague', timeZoneName: 'longOffset' })
      .formatToParts(at)
      .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';
  const m = /GMT([+-])(\d{2}):?(\d{2})?/.exec(zone);
  return m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0)) : 0;
};

/** Wall-clock time in Prague to a UTC instant; UTC keeps every calendar app in agreement. */
const pragueToUtc = (date: string, time: string) => {
  const wall = new Date(`${date}T${time}:00Z`).getTime();
  // Two passes: the offset at the first guess can sit on the other side of a DST switch.
  const first = new Date(wall - pragueOffset(new Date(wall)) * 60_000);
  return new Date(wall - pragueOffset(first) * 60_000);
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
    // An end at or before the start is after midnight: take it on the next local day.
    const end = !c.end
      ? new Date(start.getTime() + 3 * 3_600_000)
      : pragueToUtc(c.end > c.time ? c.date : nextDay(c.date), c.end);
    lines.push(`DTSTART:${utc(start)}`, `DTEND:${utc(end)}`);
  } else {
    lines.push(
      `DTSTART;VALUE=DATE:${c.date.replaceAll('-', '')}`,
      `DTEND;VALUE=DATE:${nextDay(c.date).replaceAll('-', '')}`,
    );
  }
  const location = [c.venue, c.address, c.city].filter(Boolean).join(', ');
  const description = [c.info, c.tickets, url].filter(Boolean).join('\n\n');
  lines.push(
    `SUMMARY:${escape(`Exhalace — ${c.title ?? [c.venue, c.city].filter(Boolean).join(', ')}`)}`,
    `LOCATION:${escape(location)}`,
    `DESCRIPTION:${escape(description)}`,
    `URL:${url}`,
  );
  if (c.status === 'cancelled') lines.push('STATUS:CANCELLED');
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return `${lines.map(fold).join('\r\n')}\r\n`;
};
