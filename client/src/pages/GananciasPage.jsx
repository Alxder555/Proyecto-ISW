import React, { useState } from 'react';
import { obtenerGananciasMes } from '../services/gananciaService.js';

const GananciasMensuales = () => {
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [dataGanancias, setDataGanancias] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleConsultar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const resultado = await obtenerGananciasMes(anio, mes);
            setDataGanancias(resultado);
        } catch (err) {
            setError(err.error || 'No se pudo cargar el resumen');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Resumen de Ganancias Mensuales</h1>

            {/* Formulario de selección */}
            <form onSubmit={handleConsultar} className="flex gap-4 mb-6 bg-white p-4 rounded shadow">
                <div>
                    <label className="block text-sm font-medium mb-1">Año:</label>
                    <input 
                        type="number" 
                        value={anio} 
                        onChange={(e) => setAnio(e.target.value)} 
                        className="border p-2 rounded w-28"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Mes:</label>
                    <select 
                        value={mes} 
                        onChange={(e) => setMes(e.target.value)}
                        className="border p-2 rounded"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString('es', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end">
                    <button 
                        type="submit" 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {loading ? 'Calculando...' : 'Consultar'}
                    </button>
                </div>
            </form>

            {error && <div className="text-red-600 mb-4">{error}</div>}

            {/* Resultados */}
            {dataGanancias && (
                <div className="bg-white p-6 rounded shadow">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded">
                            <p className="text-sm text-gray-600">Total Ganancias del Mes</p>
                            <p className="text-3xl font-bold text-blue-700">
                                ${dataGanancias.totalGananciasMes.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded">
                            <p className="text-sm text-gray-600">Eventos Activos Registrados</p>
                            <p className="text-3xl font-bold text-green-700">
                                {dataGanancias.cantidadEventos}
                            </p>
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold mb-3">Detalle de Eventos</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-2">Evento</th>
                                    <th className="p-2">Cliente</th>
                                    <th className="p-2">Fecha Fin</th>
                                    <th className="p-2">Transmisión</th>
                                    <th className="p-2">Auspiciador</th>
                                    <th className="p-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataGanancias.eventos.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-4 text-gray-500">
                                            No hay eventos en este periodo.
                                        </td>
                                    </tr>
                                ) : (
                                    dataGanancias.eventos.map(ev => (
                                        <tr key={ev.id} className="border-b hover:bg-gray-50">
                                            <td className="p-2 font-medium">{ev.nombre}</td>
                                            <td className="p-2">{ev.cliente || 'N/A'}</td>
                                            <td className="p-2">{new Date(ev.fechaFin).toLocaleDateString()}</td>
                                            <td className="p-2">${ev.valorTransmision.toLocaleString()}</td>
                                            <td className="p-2">${ev.aporteAuspiciador.toLocaleString()}</td>
                                            <td className="p-2 font-bold">${ev.gananciaTotalEvento.toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};


export default GananciasMensuales;