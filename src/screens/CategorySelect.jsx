import TopBar from '../components/TopBar.jsx'
import PageHeader from '../components/PageHeader.jsx'
import CategoryCard from '../components/CategoryCard.jsx'
import { CATEGORIES } from '../data/science.js'
import { getBestByCategory } from '../utils/storage.js'

export default function CategorySelect({ onSelect, onBack }) {
  const bestByCategory = getBestByCategory()

  return (
    <div className="view">
      <TopBar crumbs={['Play', 'Category']} onBack={onBack} />
      <PageHeader
        title={<>Choose a <span className="wavy">category</span>.</>}
        sub="Which branch of science will you explore today?"
      />
      <div className="card-grid card-grid-4">
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            best={bestByCategory[category.id]}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
