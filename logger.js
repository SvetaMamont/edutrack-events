export function logRequest(req) {
  const time = new Date().toLocaleString();
  console.log(`[${time}] ${req.method} ${req.url}`);
}