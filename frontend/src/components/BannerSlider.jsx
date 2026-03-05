import { useState, useEffect } from "react"
import "../styles/BannerSlider.css"
import { buildApiUrl } from "../config/api"

export default function BannerSlider() {
  const [banners, setBanners] = useState([])
  const [currentLeft, setCurrentLeft] = useState(0)
  const [currentRight, setCurrentRight] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")  

  useEffect(() => {
    fetch(buildApiUrl("/api/sliders"))
      .then(res => res.json())
      .then(data => {
        setBanners(Array.isArray(data?.data) ? data.data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError("Không tải được banner từ API")
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (banners.length === 0) return <div>Chưa có banner để hiển thị</div>

  const rightIndex = banners.length > 1 ? currentRight : currentLeft

  const prevLeftSlide = () => {
    setCurrentLeft(prev => prev === 0 ? banners.length - 1 : prev - 1)
  }

  const nextLeftSlide = () => {
    setCurrentLeft(prev => (prev + 1) % banners.length)
  }

  const prevRightSlide = () => {
    setCurrentRight(prev => prev === 0 ? banners.length - 1 : prev - 1)
  }

  const nextRightSlide = () => {
    setCurrentRight(prev => (prev + 1) % banners.length)
  }

  return (
    <div className="banner-container">

      <div className="slider-wrapper">
        <button className="nav left" onClick={prevLeftSlide}>‹</button>
        <div className="slider-track">
          <img src={banners[currentLeft].image_url} alt="banner-left" className="slide-image" />
        </div>
        <button className="nav right" onClick={nextLeftSlide}>›</button>
      </div>

      <div className="slider-wrapper">
        <button className="nav left" onClick={prevRightSlide}>‹</button>
        <div className="slider-track">
          <img src={banners[rightIndex].image_url} alt="banner-right" className="slide-image" />
        </div>
        <button className="nav right" onClick={nextRightSlide}>›</button>
      </div>

    </div>
  )
}