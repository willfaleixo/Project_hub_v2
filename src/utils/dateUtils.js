import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const parseSafeDate = (dateVal) => {
  if (!dateVal) return new Date();
  if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? new Date() : dateVal;
  
  if (typeof dateVal === 'string') {
    // Try standard ISO
    const isoParsed = new Date(dateVal);
    if (!isNaN(isoParsed.getTime())) return isoParsed;

    // Try BR format dd/MM/yyyy HH:mm
    const parts = dateVal.trim().split(' ');
    if (parts[0]) {
      const dateParts = parts[0].split('/');
      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const year = parseInt(dateParts[2], 10);
        let hours = 0, minutes = 0;
        if (parts[1]) {
          const timeParts = parts[1].split(':');
          hours = parseInt(timeParts[0], 10) || 0;
          minutes = parseInt(timeParts[1], 10) || 0;
        }
        const parsed = new Date(year, month, day, hours, minutes);
        if (!isNaN(parsed.getTime())) return parsed;
      }
    }
  }

  return new Date();
};

export const formatDateSafe = (dateVal, formatStr = "dd/MM/yyyy 'às' HH:mm") => {
  try {
    const d = parseSafeDate(dateVal);
    return format(d, formatStr, { locale: ptBR });
  } catch (e) {
    return String(dateVal || "");
  }
};
