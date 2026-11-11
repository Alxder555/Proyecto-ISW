import React, { useState } from 'react';
import GastosPage from './GastosPage';
import GananciasPage from './GananciasPage';

const ReportesPage = () => {
    // Estado para controlar qué pestaña está activa ('ganancias' o 'gastos')
    const [tabActiva, setTabActiva] = useState('ganancias');

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Panel de Contabilidad</h1>

            {/* Barra de Pestañas (Tabs) */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setTabActiva('ganancias')}
                    className={`py-2 px-6 font-semibold text-lg border-b-2 transition-colors ${
                        tabActiva === 'ganancias'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    📈 Ganancias Mensuales
                </button>
                <button
                    onClick={() => setTabActiva('gastos')}
                    className={`py-2 px-6 font-semibold text-lg border-b-2 transition-colors ${
                        tabActiva === 'gastos'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    📉 Control de Gastos
                </button>
            </div>

            {/* Contenido dinámico según la pestaña seleccionada */}
            <div className="transition-all">
                {tabActiva === 'ganancias' && <GananciasPage />}
                {tabActiva === 'gastos' && <GastosPage />}
            </div>
        </div>
    );
};

export default ReportesPage;