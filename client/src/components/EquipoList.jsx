function EquipoList({ equipos, cargando }) {
  if (cargando) return <p>Cargando...</p>;
  if (equipos.length === 0) return <p>No hay equipos registrados</p>;

  return (
    <ul>
      {equipos.map((equipo) => (
        <li key={equipo.id}>
          {equipo.nombre} — {equipo.marca} {equipo.modelo} — {equipo.estado}
        </li>
      ))}
    </ul>
  );
}

export default EquipoList;