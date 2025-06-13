const apiUrl = `http://localhost:8000/api`;

export function getCatalog() {
  return fetch(`${apiUrl}/catalog`).then(response => {
    if (!response.ok)
      throw new Error('Erreur lors de la récupération du catalogue');
    return response.json();
  });
}

export function extractServiceTypes(catalog) {
  return catalog.flatMap(category =>
    category.items.map(item => ({
      id: item.name.toLowerCase(),
      name: item.label,
      description: item.description,
      icon: null,
      color: 'default',
      image: `/img/${item.image_path}`,
      template: item.template_file,
    }))
  );
}
