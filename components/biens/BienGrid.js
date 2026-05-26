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
      <div style={{ fontSize: 13, color: '#5A6B7D', marginBottom: 16, fontWeight: 500 }}>
        {biens.length} bien{biens.length > 1 ? 's' : ''} dans le réseau
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 20,
      }}>
        {biens.map((bien) => (
          <BienCard key={bien.id} bien={bien} />
        ))}
      </div>
    </div>
  );
}