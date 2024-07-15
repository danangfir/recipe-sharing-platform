async function addRecipe(token, title, description, labels, file) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('labels', labels);
    formData.append('image', file);
  
    const addRecipeResponse = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
  
    if (!addRecipeResponse.ok) {
      throw new Error('Add recipe failed');
    }
  
    const recipeData = await addRecipeResponse.json();
    return recipeData;
  }
  
  export default addRecipe;
  