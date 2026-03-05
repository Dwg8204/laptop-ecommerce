import FilterBar from '../components/FilterBar'
import ProductListSection from '../components/ProductListSection'
import FeaturedProducts from '../components/FeaturedProducts'
import Pagination from '../components/Pagination'

export default function Home() {
  return (
    <>
      <FilterBar />
      <ProductListSection />
      <Pagination />
    </>
  )
}