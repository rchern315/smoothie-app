import { useState } from 'react'
import './SmoothieCard.css'

const SmoothieCard = ({ smoothie }) => {
  const [showModal, setShowModal] = useState(false)

  const shareRecipe = (platform) => {
    const url = `${window.location.origin}/smoothie/${smoothie.id}`
    const text = `Check out this smoothie recipe: ${smoothie.title}`
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}&media=${encodeURIComponent(smoothie.image)}`
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/smoothie/${smoothie.id}`)
    alert('Link copied to clipboard!')
  }

  return (
    <>
      <div className="ft-recipe">
        <div className="ft-recipe__thumb">
          <h3>Smoothie Recipe</h3>
          <img 
            src={smoothie.image || 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800'} 
            alt={smoothie.title} 
          />
        </div>
        
        <div className="ft-recipe__content">
          <header className="content__header">
            <div className="row-wrapper">
              <h2 className="recipe-title">{smoothie.title}</h2>
            </div>
            
            <ul className="recipe-details">
              <li className="recipe-details-item time">
                <i className="ion ion-ios-clock-outline"></i>
                <span className="value">{smoothie.time || 5}</span>
                <span className="title">Minutes</span>
              </li>
              <li className="recipe-details-item ingredients">
                <i className="ion ion-ios-book-outline"></i>
                <span className="value">
                  {smoothie.ingredients?.length || 0}
                </span>
                <span className="title">Ingredients</span>
              </li>
              <li className="recipe-details-item servings">
                <i className="ion ion-ios-person-outline"></i>
                <span className="value">{smoothie.servings || 2}</span>
                <span className="title">Servings</span>
              </li>
            </ul>
          </header>
          
          <p className="description">
            {smoothie.description ? 
              (smoothie.description.length > 120 ? 
                smoothie.description.substring(0, 120) + '...' : 
                smoothie.description) 
              : 'A delicious and healthy smoothie recipe!'}
          </p>
          
          <footer className="content__footer">
            <button onClick={() => setShowModal(true)}>View Recipe</button>
          </footer>
        </div>
      </div>

      {/* Modal/Drawer */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setShowModal(false)}>
              &times;
            </span>
            
            <img 
              src={smoothie.image || 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800'} 
              alt={smoothie.title} 
            />
            <h2>{smoothie.title}</h2>
            
            <div className="full-recipe">
              <h3>Description</h3>
              <p>{smoothie.description || 'No description available.'}</p>
              
              {smoothie.ingredients && smoothie.ingredients.length > 0 && (
                <>
                  <h3>Ingredients</h3>
                  <ul className="ingredients-display">
                    {smoothie.ingredients.map((ing, index) => (
                      <li key={index}>
                        <strong>{ing.amount}</strong> {ing.name}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              
              <h3>Directions</h3>
              <p>{smoothie.directions || 'No directions available.'}</p>
            </div>
            
            <div className="share-buttons">
              <h4>Share this recipe:</h4>
              <button onClick={() => shareRecipe('twitter')}>
                <i className="ion ion-logo-twitter"></i> Twitter
              </button>
              <button onClick={() => shareRecipe('facebook')}>
                <i className="ion ion-logo-facebook"></i> Facebook
              </button>
              <button onClick={() => shareRecipe('pinterest')}>
                <i className="ion ion-logo-pinterest"></i> Pinterest
              </button>
              <button onClick={copyLink}>
                <i className="ion ion-md-link"></i> Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SmoothieCard