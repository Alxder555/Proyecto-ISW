import React, { useState, useEffect } from 'react';
import { obtenerGastos, crearGasto } from '../services/gastoService';

export default function GastosPage() {
    const [gastos, setGastos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Estado del formulario de nuevo gasto
    const [formData, setFormData] = useState({
        eventoId: '',
        tipo: 'MOVILIZACION',
        monto: '',
        puntoSalida: '',
        puntoLlegada: '',
        comprobante: '',
        observacion: ''
    });

    // Cargar los gastos al montar el componente
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const data = await obtenerGastos();
            setGastos(data);
        } catch (err) {
            setError('Error al cargar los gastos financieros');
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Aseguramos que eventoId y monto sean números
            const payload = {
                ...formData,
                eventoId: Number(formData.eventoId),
                monto: parseFloat(formData.monto)
            };

            await crearGasto(payload);
            
            // Limpiar formulario y recargar lista
            setFormData({
                eventoId: '',
                tipo: 'MOVILIZACION',
                monto: '',
                puntoSalida: '',
                puntoLlegada: '',
                comprobante: '',
                observacion: ''
            });
            cargarDatos();
        } catch (err) {
            alert('Error al registrar el gasto. Revisa los datos.');
            console.error(err);
        }
    };

    if (cargando) return <div className="p-6 text-white">Cargando módulo financiero...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6">Gestión Financiera y Reembolsos</h1>

            {error && <div className="bg-red-500 p-4 rounded mb-4">{error}</div>}

            {/* Formulario de Registro */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Registrar Nuevo Gasto / Reembolso</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm mb-1">ID de Evento</label>
                        <input 
                            type="number" 
                            name="eventoId" 
                            value={formData.eventoId} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Tipo de Gasto</label>
                        <select 
                            name="tipo" 
                            value={formData.tipo} 
                            onChange={handleChange} 
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                        >
                            <option value="REMUNERACION">Remuneración Operador</option>
                            <option value="MOVILIZACION">Movilización (Uber)</option>
                            <option value="PEAJE">Peaje</option>
                            <option value="OTRO">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Monto ($)</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            name="monto" 
                            value={formData.monto} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Comprobante (URL o Código)</label>
                        <input 
                            type="text" 
                            name="comprobante" 
                            value={formData.comprobante} 
                            onChange={handleChange} 
                            placeholder="Ej. Enlace a boleta o voucher"
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                        />
                    </div>
                    {formData.tipo === 'MOVILIZACION' && (
                        <>
                            <div>
                                <label className="block text-sm mb-1">Punto de Salida</label>
                                <input 
                                    type="text" 
                                    name="puntoSalida" 
                                    value={formData.puntoSalida} 
                                    onChange={handleChange} 
                                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Punto de Llegada</label>
                                <input 
                                    type="text" 
                                    name="puntoLlegada" 
                                    value={formData.puntoLlegada} 
                                    onChange={handleChange} 
                                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                                />
                            </div>
                        </>
                    )}
                    <div className="md:col-span-2">
                        <label className="block text-sm mb-1">Observación</label>
                        <input 
                            type="text" 
                            name="observacion" 
                            value={formData.observacion} 
                            onChange={handleChange} 
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
                        >
                            Guardar Registro Financiero
                        </button>
                    </div>
                </form>
            </div>

            {/* Listado de Gastos */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Historial de Gastos y Reembolsos</h2>
                {gastos.length === 0 ? (
                    <p className="text-gray-400">No hay registros financieros todavía.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-700 text-gray-400">
                                    <th className="p-3">Fecha</th>
                                    <th className="p-3">Tipo</th>
                                    <th className="p-3">Monto</th>
                                    <th className="p-3">Evento ID</th>
                                    <th className="p-3">Detalles</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gastos.map((g) => (
                                    <tr key={g.id} className="border-b border-gray-700 hover:bg-gray-750">
                                        <td className="p-3">{new Date(g.fecha).toLocaleDateString()}</td>
                                        <td className="p-3 font-medium text-blue-400">{g.tipo}</td>
                                        <td className="p-3">${g.monto}</td>
                                        <td className="p-3">{g.eventoId}</td>
                                        <td className="p-3 text-sm text-gray-300">
                                            {g.puntoSalida ? `${g.puntoSalida} ➔ ${g.puntoLlegada}` : (g.observacion || 'Sin detalles')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}