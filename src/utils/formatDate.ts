export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).replace("à ", "à ")
}