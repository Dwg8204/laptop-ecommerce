import { useState } from "react"
import CategoryBar from "../components/CategoryBar"
import BannerSlider from "../components/BannerSlider"
import LaptopFilterSection from "../components/LaptopFilterSection"
import FeaturedProducts from "../components/FeaturedProducts"
import FilterBar from "../components/FilterBar"
import ProductListSection from "../components/ProductListSection"
import HomeArticleSection from "../components/HomeArticleSection"
import QASection from "../components/QASection"
import Footer from "../components/Footer"

export default function Laptop() {
  const [filters, setFilters] = useState(null)
  const [sortBy, setSortBy] = useState('popular')

  const handleFilterChange = (newFilters, newSortBy) => {
    setFilters(newFilters)
    setSortBy(newSortBy)
  }

  return (
    <>
      <CategoryBar />
      <BannerSlider />
      <LaptopFilterSection />
      <FeaturedProducts />
      <FilterBar onFilterChange={handleFilterChange} />
      <ProductListSection filters={filters} sortBy={sortBy} />
      <HomeArticleSection />
      <QASection />
      <Footer />
    </>
  )
}