/* eslint-disable react/prop-types */

const OrdenarInventario = ({onOrdenar,valorSeleccionado})=>{
    const handleOrdenarChange =(e) =>{
        onOrdenar(e.target.value);
    };
    return(
        <div className="mb-4">
      <label htmlFor="ordenar" className="mr-2">Ordenar por:</label>
      <select id="ordenar" onChange={handleOrdenarChange} className="border bg-base-300 p-2 rounded" value={valorSeleccionado}>
        <option value="">Fecha (más antigua a más reciente)</option>
        <option value="fecha">Fecha (más reciente a más antigua)</option>
        <option value="nombre">Nombre (A-Z)</option>
        <option value="proveedor">Proveedor (A-Z)</option>
        <option value="categoria">Categoría (A-Z)</option>
      </select>
    </div>
    );
};

export default OrdenarInventario;