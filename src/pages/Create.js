import { useState } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "../config/supabaseClient"

const Create = () => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [directions, setDirections] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [time, setTime] = useState('')
  const [servings, setServings] = useState('')
  const [ingredients, setIngredients] = useState([{ amount: '', name: '' }])
  const [formError, setFormError] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Add new ingredient row
  const addIngredient = () => {
    setIngredients([...ingredients, { amount: '', name: '' }])
  }

  // Remove ingredient row
  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index)
    setIngredients(newIngredients)
  }

  // Update ingredient
  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index][field] = value
    setIngredients(newIngredients)
  }

  // Upload image to Supabase Storage
  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('smoothie-images')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    // Get public URL
    const { data } = supabase.storage
      .from('smoothie-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!title || !description || !directions) {
      setFormError('Please fill in title, description, and directions.')
      return
    }

    // Filter out empty ingredients
    const validIngredients = ingredients.filter(
      ing => ing.amount.trim() !== '' && ing.name.trim() !== ''
    )

    if (validIngredients.length === 0) {
      setFormError('Please add at least one ingredient.')
      return
    }

    try {
      setUploading(true)
      
      // Handle image upload
      let finalImageUrl = imageUrl || 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800'
      
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile)
      }

      // Insert data
      const { data, error } = await supabase
        .from('Smoothies')
        .insert([{ 
          title, 
          description,
          directions,
          image: finalImageUrl,
          time: time || 5,
          ingredients: validIngredients,
          servings: servings || 2
        }])
        .select()

      if (error) {
        console.error('Full error details:', error)
        setFormError(`Error: ${error.message}`)
        return
      }
      
      if (data) {
        console.log('Success! Data:', data)
        setFormError(null)
        navigate('/')
      }
    } catch (error) {
      console.error('Error:', error)
      setFormError('Error creating smoothie recipe. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="page create">
      <form onSubmit={handleSubmit}>
        <h2>Create New Smoothie Recipe</h2>
        
        <div className="form-group">
          <label htmlFor="title">Recipe Title *</label>
          <input 
            type="text" 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Berry Blast Smoothie"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea 
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Brief description of your smoothie..."
            required
          />
        </div>

        {/* Image Upload Section */}
        <div className="form-group">
          <label>Recipe Image</label>
          <div className="image-upload-section">
            <div className="upload-option">
              <label htmlFor="imageFile" className="file-upload-label">
                📁 Upload Image
              </label>
              <input 
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={(e) => {
                  setImageFile(e.target.files[0])
                  setImageUrl('') // Clear URL if file is selected
                }}
                style={{ display: 'none' }}
              />
              {imageFile && <small className="file-name">Selected: {imageFile.name}</small>}
            </div>
            
            <div className="upload-divider">OR</div>
            
            <div className="upload-option">
              <input 
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value)
                  setImageFile(null) // Clear file if URL is entered
                }}
                placeholder="Paste image URL here"
                disabled={imageFile !== null}
              />
            </div>
          </div>
          <small>Upload an image or paste a URL (leave blank for default)</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="time">Prep Time (minutes)</label>
            <input 
              type="number"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="5"
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="servings">Servings</label>
            <input 
              type="number"
              id="servings"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              placeholder="2"
              min="1"
            />
          </div>
        </div>

        {/* Dynamic Ingredients */}
        <div className="form-group">
          <label>Ingredients *</label>
          <div className="ingredients-list">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <input 
                  type="text"
                  value={ingredient.amount}
                  onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                  placeholder="1 cup"
                  className="ingredient-amount"
                />
                <input 
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  placeholder="strawberries"
                  className="ingredient-name"
                />
                {ingredients.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeIngredient(index)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button 
            type="button" 
            onClick={addIngredient}
            className="add-ingredient-btn"
          >
            + Add Ingredient
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="directions">Directions *</label>
          <textarea 
            id="directions"
            value={directions}
            onChange={(e) => setDirections(e.target.value)}
            rows="8"
            placeholder="Step-by-step instructions for making your smoothie..."
            required
          />
        </div>

        <button type="submit" disabled={uploading}>
          {uploading ? 'Creating...' : 'Create Smoothie Recipe'}
        </button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  )
}

export default Create