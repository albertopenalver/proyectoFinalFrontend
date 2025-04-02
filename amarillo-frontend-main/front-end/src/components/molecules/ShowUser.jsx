/* eslint-disable react/prop-types */



const ShowUser = ({ isOpen, onClose, users, handleDeleteUser, handleAssignAdmin }) => {



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
      <div className="modal modal-open">
        <div className="modal-box">
          <div className="modal-header flex justify-between items-center">
            <h3 className="text-lg font-bold">Lista de Usuarios</h3>
            <button className="text-xl" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="modal-body">
            <ul>
              {users.map((user) => (
                <li key={user._id} className="flex justify-between items-center mb-2">
                  <div>
                    {user.nombre} - {user.email} - {user.permisos}
                  </div>
                  <div>
                    {(user.permisos !== 'admin' && user.permisos !== 'creador') && (
                      <button className="btn btn-secondary mr-2" onClick={() => handleAssignAdmin(user._id)}>
                        Asignar Admin
                      </button>
                    )}
                    <button className="btn btn-danger" onClick={() => handleDeleteUser(user._id)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUser;
