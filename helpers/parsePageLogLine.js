const propertyGetterRegex = /(\w*)=\[(.*?)\]/g;

export default function parsePageLogLine(logLine) {
  return Array.from(logLine.matchAll(propertyGetterRegex))
    .reduce((prev, [,property, value]) =>
      Object.assign(prev, {[property]: value})
    , {}
  );
}