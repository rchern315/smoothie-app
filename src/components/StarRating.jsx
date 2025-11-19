import { useState, useEffect, useCallback } from 'react'
import supabase from '../config/supabaseClient'

const StarRating = ({ smoothieId, currentUser }) => {
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [hover, setHover] = useState(0)

  const fetchRatings = useCallback(async () => {
    // Get all ratings for this smoothie
    const { data } = await supabase
      .from('ratings')
      .select('rating')
      .eq('smoothie_id', smoothieId)

    if (data && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length
      setAverageRating(avg.toFixed(1))
      setTotalRatings(data.length)
    } else {
      setAverageRating(0)
      setTotalRatings(0)
    }
  }, [smoothieId])

  const fetchUserRating = useCallback(async () => {
  if (!currentUser) {
    setUserRating(0)  // 👈 Reset if not logged in
    return
  }
  
  // Check if user already rated
  const { data } = await supabase
    .from('ratings')
    .select('rating')
    .eq('smoothie_id', smoothieId)
    .eq('user_id', currentUser.id)
    .single()

  if (data) {
    setUserRating(data.rating)
  } else {
    setUserRating(0)  
  }
}, [smoothieId, currentUser])

  useEffect(() => {
    fetchRatings()
    fetchUserRating()
  }, [fetchRatings, fetchUserRating])

  const handleRating = async (ratingValue) => {
    if (!currentUser) {
      alert('Please sign in to rate recipes')
      return
    }

    // Upsert rating (insert or update)
    const { error } = await supabase
      .from('ratings')
      .upsert({
        smoothie_id: smoothieId,
        user_id: currentUser.id,
        rating: ratingValue
      }, {
        onConflict: 'smoothie_id,user_id'
      })

    if (!error) {
      setUserRating(ratingValue)
      fetchRatings() // Refresh average
    } else {
      console.error('Rating error:', error)
    }
  }

  return (
    <div className="star-rating">
   <div className="stars">
  {[1, 2, 3, 4, 5].map((star) => (
    <span
      key={star}
      className={`star ${
        star <= (hover > 0 ? hover : userRating) ? 'filled' : ''
      }`}
      onClick={() => handleRating(star)}
      onMouseEnter={() => currentUser && setHover(star)}
      onMouseLeave={() => setHover(0)}
      style={{ cursor: currentUser ? 'pointer' : 'default' }}
    >
      {star <= (hover > 0 ? hover : userRating) ? '★' : '☆'}
    </span>
  ))}
</div>
      
      <div className="rating-info">
        {totalRatings > 0 ? (
          <>
            <span className="average">{averageRating}</span>
            <span className="count">({totalRatings} rating{totalRatings !== 1 ? 's' : ''})</span>
          </>
        ) : (
          <span className="no-ratings">No ratings yet</span>
        )}
      </div>
      
      {userRating > 0 && (
        <small className="user-rating">You rated this {userRating} stars</small>
      )}
    </div>
  )
}

export default StarRating