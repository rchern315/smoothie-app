import { useState } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "../config/supabaseClient"

const Create = () => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [formError, setFormError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description) {
      setFormError('Please fill in all the required fields.')
      return
    }

    const { data, error } = await supabase
      .from('smoothies')
      .insert([{ 
        title, 
        description, 
        image: image || 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800'
      }])
      .select()

    if (error) {
      console.log(error)
      setFormError('Error creating smoothie recipe. Please try again.')
    }
    
    if (data) {
      console.log(data)
      setFormError(null)
      navigate('/')
    }
  }

  return (
    <div className="page create">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input 
          type="text" 
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Berry Blast Smoothie"
        />

        <label htmlFor="description">Description / Recipe:</label>
        <textarea 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="8"
          placeholder="Describe your smoothie and list the ingredients..."
        />

        <label htmlFor="image">Image URL:</label>
        <input 
          type="url"
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/smoothie-image.jpg (optional)"
        />
        <small style={{display: 'block', marginTop: '-15px', marginBottom: '15px', color: '#666'}}>
          Leave blank for a default smoothie image
        </small>

        <button>Create Smoothie Recipe</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  )
}

export default Create