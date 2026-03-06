import { useState } from 'react'
import { FiFilter, FiTruck, FiBox, FiDollarSign, FiChevronDown, FiInfo, FiStar, FiTag, FiArrowUp, FiArrowDown, FiX } from 'react-icons/fi'
import '../styles/FilterBar.css'

const filterOptions = {
  storage: ['128GB', '256GB', '512GB', '1TB', '2TB'],
  ram: ['4GB', '8GB', '16GB', '32GB', '64GB'],
  cpu: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'],
  screenSize: ['13 inch', '14 inch', '15.6 inch', '16 inch', '17 inch'],
  resolution: ['HD (1366x768)', 'Full HD (1920x1080)', '2K (2560x1440)', '4K (3840x2160)'],
  graphics: ['Intel UHD', 'Intel Iris Xe', 'NVIDIA GTX 1650', 'NVIDIA RTX 3050', 'NVIDIA RTX 4050', 'NVIDIA RTX 4060'],
  features: ['Màn hình cảm ứng', 'Bàn phím có đèn', 'Chống nước', 'Mỏng nhẹ', 'Pin trâu'],
  ai: ['Intel AI', 'NVIDIA AI', 'AMD AI'],
  brand: ['ASUS', 'Dell', 'HP', 'Lenovo', 'Acer', 'MSI', 'Apple'],
  series: ['Gaming', 'Văn phòng', 'Đồ họa', 'Cao cấp', 'Sinh viên'],
}

const filterConfig = [
  { id: 'toggle', label: 'Bộ lọc', icon: FiFilter, isToggle: true },
  { id: 'inStock', label: 'Sẵn hàng', icon: FiTruck },
  { id: 'newArrival', label: 'Hàng mới về', icon: FiBox },
  { id: 'priceRange', label: 'Xem theo giá', icon: FiDollarSign, hasDropdown: true, type: 'price' },
  { id: 'storage', label: 'Ổ cứng', hasDropdown: true, options: filterOptions.storage },
  { id: 'ram', label: 'Dung lượng RAM', hasDropdown: true, options: filterOptions.ram },
  { id: 'cpu', label: 'CPU', hasDropdown: true, options: filterOptions.cpu },
  { id: 'screenSize', label: 'Kích thước màn hình', hasDropdown: true, options: filterOptions.screenSize },
  { id: 'resolution', label: 'Độ phân giải', hasDropdown: true, options: filterOptions.resolution },
  { id: 'graphics', label: 'Card đồ họa', hasDropdown: true, options: filterOptions.graphics },
  { id: 'features', label: 'Tính năng đặc biệt', hasDropdown: true, options: filterOptions.features },
  { id: 'ai', label: 'Công nghệ AI', hasDropdown: true, options: filterOptions.ai },
  { id: 'brand', label: 'Hãng sản xuất', hasDropdown: true, options: filterOptions.brand },
  { id: 'series', label: 'Dòng sản phẩm', hasDropdown: true, options: filterOptions.series },
]

const priceRanges = [
  { label: 'Dưới 10 triệu', min: 0, max: 10000000 },
  { label: '10 - 15 triệu', min: 10000000, max: 15000000 },
  { label: '15 - 20 triệu', min: 15000000, max: 20000000 },
  { label: '20 - 25 triệu', min: 20000000, max: 25000000 },
  { label: '25 - 30 triệu', min: 25000000, max: 30000000 },
  { label: 'Trên 30 triệu', min: 30000000, max: Infinity },
]

export default function FilterBar({ onFilterChange }) {
  const [showFilters, setShowFilters] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState({
    inStock: false,
    newArrival: false,
    priceRange: null,
    storage: [],
    ram: [],
    cpu: [],
    screenSize: [],
    resolution: [],
    graphics: [],
    features: [],
    ai: [],
    brand: [],
    series: [],
  })
  const [sortBy, setSortBy] = useState('popular')

  const handleToggleFilter = () => {
    setShowFilters(!showFilters)
  }

  const handleQuickFilter = (filterId) => {
    const newFilters = {
      ...selectedFilters,
      [filterId]: !selectedFilters[filterId]
    }
    setSelectedFilters(newFilters)
    onFilterChange?.(newFilters, sortBy)
  }

  const handleDropdownToggle = (filterId) => {
    setActiveDropdown(activeDropdown === filterId ? null : filterId)
  }

  const handleOptionSelect = (filterId, option) => {
    let newFilters = { ...selectedFilters }
    
    if (filterId === 'priceRange') {
      newFilters.priceRange = newFilters.priceRange?.label === option.label ? null : option
    } else {
      const currentValues = newFilters[filterId] || []
      if (currentValues.includes(option)) {
        newFilters[filterId] = currentValues.filter(v => v !== option)
      } else {
        newFilters[filterId] = [...currentValues, option]
      }
    }
    
    setSelectedFilters(newFilters)
    onFilterChange?.(newFilters, sortBy)
  }

  const handleSort = (sortType) => {
    setSortBy(sortType)
    onFilterChange?.(selectedFilters, sortType)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      inStock: false,
      newArrival: false,
      priceRange: null,
      storage: [],
      ram: [],
      cpu: [],
      screenSize: [],
      resolution: [],
      graphics: [],
      features: [],
      ai: [],
      brand: [],
      series: [],
    }
    setSelectedFilters(clearedFilters)
    onFilterChange?.(clearedFilters, sortBy)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (selectedFilters.inStock) count++
    if (selectedFilters.newArrival) count++
    if (selectedFilters.priceRange) count++
    Object.keys(selectedFilters).forEach(key => {
      if (Array.isArray(selectedFilters[key])) {
        count += selectedFilters[key].length
      }
    })
    return count
  }

  return (
    <div className="filter-bar-wrapper">
      <div className="filter-header">
        <h2 className="filter-title">Chọn theo tiêu chí</h2>
        {getActiveFilterCount() > 0 && (
          <button className="clear-filters-btn" onClick={clearAllFilters}>
            <FiX /> Xóa bộ lọc ({getActiveFilterCount()})
          </button>
        )}
      </div>
      
      {showFilters && (
        <div className="filter-row">
          {filterConfig.map((filter) => {
            const Icon = filter.icon
            const isActive = filter.id === 'inStock' ? selectedFilters.inStock : 
                           filter.id === 'newArrival' ? selectedFilters.newArrival :
                           filter.id === 'priceRange' ? selectedFilters.priceRange !== null :
                           selectedFilters[filter.id]?.length > 0

            if (filter.isToggle) {
              return (
                <button
                  key={filter.id}
                  className={`filter-btn filter-toggle ${showFilters ? 'active' : ''}`}
                  onClick={handleToggleFilter}
                >
                  {Icon && <Icon />}
                  {filter.label}
                </button>
              )
            }

            if (filter.hasDropdown) {
              return (
                <div key={filter.id} className="filter-dropdown-container">
                  <button
                    className={`filter-btn ${isActive ? 'active' : ''} ${activeDropdown === filter.id ? 'dropdown-open' : ''}`}
                    onClick={() => handleDropdownToggle(filter.id)}
                  >
                    {Icon && <Icon />}
                    {filter.label}
                    {isActive && selectedFilters[filter.id]?.length > 0 && (
                      <span className="filter-count">({selectedFilters[filter.id].length})</span>
                    )}
                    {isActive && filter.id === 'priceRange' && (
                      <span className="filter-count">(1)</span>
                    )}
                    <FiChevronDown className={activeDropdown === filter.id ? 'rotate' : ''} />
                  </button>
                  
                  {activeDropdown === filter.id && (
                    <div className="filter-dropdown-menu">
                      {filter.type === 'price' ? (
                        priceRanges.map((range, idx) => (
                          <label key={idx} className="filter-option">
                            <input
                              type="radio"
                              checked={selectedFilters.priceRange?.label === range.label}
                              onChange={() => handleOptionSelect(filter.id, range)}
                            />
                            <span>{range.label}</span>
                          </label>
                        ))
                      ) : (
                        filter.options?.map((option, idx) => (
                          <label key={idx} className="filter-option">
                            <input
                              type="checkbox"
                              checked={selectedFilters[filter.id]?.includes(option)}
                              onChange={() => handleOptionSelect(filter.id, option)}
                            />
                            <span>{option}</span>
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <button
                key={filter.id}
                className={`filter-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleQuickFilter(filter.id)}
              >
                {Icon && <Icon />}
                {filter.label}
              </button>
            )
          })}
        </div>
      )}
  
      <div className="sort-row">
        <h2 className="sort-title">Sắp xếp theo</h2>
        <button
          className={`sort-btn ${sortBy === 'popular' ? 'selected' : ''}`}
          onClick={() => handleSort('popular')}
        >
          <FiStar />
          Phổ biến
        </button>
        <button
          className={`sort-btn ${sortBy === 'promotion' ? 'selected' : ''}`}
          onClick={() => handleSort('promotion')}
        >
          <FiTag />
          Khuyến mãi HOT
        </button>
        <button
          className={`sort-btn ${sortBy === 'priceAsc' ? 'selected' : ''}`}
          onClick={() => handleSort('priceAsc')}
        >
          <FiArrowUp />
          Giá Thấp - Cao
        </button>
        <button
          className={`sort-btn ${sortBy === 'priceDesc' ? 'selected' : ''}`}
          onClick={() => handleSort('priceDesc')}
        >
          <FiArrowDown />
          Giá Cao - Thấp
        </button>
      </div>
    </div>
  )
}
