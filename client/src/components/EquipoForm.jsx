import { useState } from 'react';

function EquipoForm({ onSubmit }) {
    const [form, setForm] = useState({
        nombre: '',
        marca: '',
        modelo: '',
        cantidad: 1,
        precio: 0,
    });
    const [error, setError] = useState(null);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'cantidad' || name === 'precio' ? Number(value) : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        try {
            await onSubmit(form);
            setForm({ nombre: '', marca: '', modelo: '', cantidad: 1, precio: 0 });
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
            <input name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} required />
            <input name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} required />
            <input name="cantidad" type="number" placeholder="Cantidad" value={form.cantidad} onChange={handleChange} required />
            <input name="precio" type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={handleChange} required />
            <button type="submit">Crear equipo</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default EquipoForm;