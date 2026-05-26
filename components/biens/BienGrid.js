import BienCard from './BienCard';
import EmptyState from '../ui/EmptyState';

export default function BienGrid({ biens, hasFilters = false }) {
  if (biens.length === 0) {
    return (
      <EmptyState
        title={hasFilters ? 'Aucun bien ne correspond' : 'Aucun bien disponible'}
        description={hasFilters ? 'Essayez de modifier vos filtres' : 'Les autres agences n\'ont pas encore publié de biens'}
      />
    );
  }

  return (
    <div>
      <style>{`
        @media (max-width: 1024px) {
          .catalogue-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      
      <div className="catalogue-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {biens.map((bien) => (
          <BienCard key={bien.id} bien={bien} />
        ))}
      </div>
    </div>
  );
}