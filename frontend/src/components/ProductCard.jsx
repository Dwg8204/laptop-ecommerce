export default function ProductCard({
  title = 'Laptop ASUS TUF Gaming F16',
  price = '22.490.000đ',
  oldPrice = '24.490.000đ',
  discount = 'Giảm 8%',
  specs = 'CORE i5-210H | RTX 3050 | 16GB | 512GB | 16\" WUXGA',
  promo = 'S-Student giảm thêm 500.000đ',
  img = 'https://via.placeholder.com/250x150',
}) {
  return (
    <div style={styles.card}>
      <div style={styles.imageWrapper}>
        <img src={img} alt={title} style={styles.image} />
        <div style={styles.discountBadge}>{discount}</div>
        <div style={styles.installBadge}>Trả góp 0%</div>
      </div>
      <div style={styles.content}>
        <div style={styles.specs}>{specs}</div>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.priceWrapper}>
          <span style={styles.price}>{price}</span>
          <span style={styles.oldPrice}>{oldPrice}</span>
        </div>
        <div style={styles.promo}>{promo}</div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '12px',
    width: '220px',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '140px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    background: '#e30019',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  installBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: '#eef6ff',
    color: '#1a73e8',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  content: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  specs: {
    fontSize: '12px',
    color: '#555',
  },
  title: {
    fontSize: '14px',
    margin: 0,
  },
  priceWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  price: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#e30019',
  },
  oldPrice: {
    fontSize: '12px',
    textDecoration: 'line-through',
    color: '#999',
  },
  promo: {
    fontSize: '12px',
    color: '#555',
    background: '#f0f5ff',
    padding: '4px',
    borderRadius: '4px',
  },
}