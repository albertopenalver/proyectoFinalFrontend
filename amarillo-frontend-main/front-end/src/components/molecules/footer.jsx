const Footer = () => {
    return (
      <footer className="bg-neutral text-gray-300 py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">
          © {new Date().getFullYear()}  Todos los derechos reservados.
          </p>
          
          <p className="text-xs mt-4">
            Diseñado con <span className="text-red-500">&hearts;</span> por El Grupo <spam className=" text-yellow-300">Amarillo</spam>.
          </p>
          
        </div>
      </footer>
    );
  };
  
  export default Footer;
  