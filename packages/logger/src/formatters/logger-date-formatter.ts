/**
 * Partes completas de fecha usadas por el logger.
 */
interface LoggerDateTimeParts {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
}

/**
 * Obtiene una parte específica generada por Intl.DateTimeFormat.
 */
function getPart(parts: Intl.DateTimeFormatPart[], type: string): string {
  const value = parts.find((part) => part.type === type)?.value;

  if (!value) {
    throw new Error(`No se pudo resolver la parte de fecha "${type}" para el logger.`);
  }

  return value;
}

/**
 * Obtiene partes de fecha y hora usando una zona horaria específica.
 */
function getDateTimeParts(date: Date, timeZone: string): LoggerDateTimeParts {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });

  const parts = formatter.formatToParts(date);

  return {
    year: getPart(parts, 'year'),
    month: getPart(parts, 'month'),
    day: getPart(parts, 'day'),
    hour: getPart(parts, 'hour'),
    minute: getPart(parts, 'minute'),
    second: getPart(parts, 'second')
  };
}

/**
 * Formatea una fecha al estilo:
 *
 * YYYY-MM-DD HH:mm:ss
 */
export function formatLoggerDate(date: Date, timeZone: string): string {
  const parts = getDateTimeParts(date, timeZone);

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}
