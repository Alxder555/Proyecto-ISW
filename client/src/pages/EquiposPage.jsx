import { useEquipos } from '../hooks/useEquipos';
import EquipoForm from '../components/EquipoForm';
import EquipoList from '../components/EquipoList';

function EquiposPage() {
  const { equipos, cargando, error, agregarEquipo } = useEquipos();

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      <h1>Equipos</h1>

      <EquipoForm onSubmit={agregarEquipo} />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <EquipoList equipos={equipos} cargando={cargando} />
    </div>
  );
}

export default EquiposPage;