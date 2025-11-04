import '../index.css'  
const SmoothieCard = ({smoothie}) => {
  return (
    <div className="smoothie-card">
      <h3>{smoothie.title}</h3>
      <p>{smoothie.method}</p>
      <div className="smoothie-rating">{smoothie.rating}</div>
     
    </div>
   
  )
}

export default SmoothieCard