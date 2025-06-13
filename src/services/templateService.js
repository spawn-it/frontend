const apiUrl = `http://localhost:8000/api`;

export function getTemplate(file) {
  return fetch(`${apiUrl}/template/${encodeURIComponent(file)}`).then(
    response => {
      if (!response.ok) throw new Error(`Template "${file}" introuvable`);
      return response.json();
    }
  );
}
