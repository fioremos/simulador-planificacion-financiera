/**
 * Descripción:
 *  Este módulo provee funciones reutilizables para gestionar el almacenamiento
 *  persistente del navegador. Permite crear, leer, actualizar y eliminar datos
 *  tanto en localStorage como en sessionStorage, aplicando serialización JSON
 *  y manejo robusto de errores. Incluye helpers para guardar y cargar
 *  colecciones de clases con métodos toJSON() y fromJSON().
 */

const StorageUtil = (() => {
  /**
   * Retorna la instancia de almacenamiento según el tipo especificado.
   * @param {'local'|'session'} tipo - Tipo de storage ('local' o 'session')
   * @returns {Storage} Objeto de almacenamiento correspondiente
   */
  const getStorage = (tipo = 'local') =>
    tipo === 'session' ? sessionStorage : localStorage;

  // -----------------------------
  // Operaciones CRUD básicas
  // -----------------------------

  /**
   * Guarda un valor en el storage seleccionado.
   * @param {string} clave - Clave bajo la cual se almacenará el valor
   * @param {any} valor - Valor a guardar (se serializa automáticamente si es objeto)
   * @param {'local'|'session'} tipo - Tipo de storage
   * @returns {boolean} true si se guardó correctamente, false en caso de error
   */
  const guardar = (clave, valor, tipo = 'local') => {
    try {
      const storage = getStorage(tipo);

      // Estimación del tamaño actual del storage en bytes
      const usoActual = Object.keys(storage).reduce((total, key) => {
        const val = storage.getItem(key);
        return total + (key.length + (val ? val.length : 0)) * 2; // cada char ~2 bytes
      }, 0);

      // Tamaño estimado del nuevo dato
        const dataString =
            typeof valor === 'object' ? JSON.stringify(valor) : String(valor);
        const nuevoTamaño = dataString.length * 2;

      // Límite estimado (5 MB = 5 * 1024 * 1024 bytes)
      const LIMITE = 5 * 1024 * 1024;

      if (usoActual + nuevoTamaño > LIMITE) {
        console.warn(`[StorageUtil] Espacio insuficiente en ${tipo}Storage. No se guardó "${clave}".`);
        return false;
      }

      // Intentar guardar el dato
      storage.setItem(clave, dataString);
      //console.info(`[StorageUtil] "${clave}" guardado correctamente en ${tipo}Storage.`);
      return true;

    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error(`[StorageUtil] ${tipo}Storage lleno. No se pudo guardar "${clave}".`);
      } else {
        console.error(`[StorageUtil] Error al guardar "${clave}": ${error.message}`);
      }
      return false;
    }
  };

  /**
   * Obtiene un valor del storage.
   * @param {string} clave - Clave del valor a recuperar
   * @param {'local'|'session'} tipo - Tipo de storage
   * @returns {any|null} Valor deserializado o null si no existe o hay error
   */
  const obtener = (clave, tipo = 'local') => {
    try {
      const storage = getStorage(tipo);
      const data = storage.getItem(clave);
      if (data === null) return null;
      return JSON.parse(data);
    } catch (error) {
      console.warn(`[StorageUtil] Error al obtener ${clave}: ${error.message}`);
      return null;
    }
  };

  /**
   * Actualiza un valor existente en el storage (equivalente a guardar()).
   * @param {string} clave - Clave del valor a actualizar
   * @param {any} valor - Nuevo valor
   * @param {'local'|'session'} tipo - Tipo de storage
   * @returns {boolean} true si se actualizó correctamente
   */
  const actualizar = (clave, valor, tipo = 'local') => guardar(clave, valor, tipo);

  /**
   * Elimina un valor del storage.
   * @param {string} clave - Clave del valor a eliminar
   * @param {'local'|'session'} tipo - Tipo de storage
   * @returns {boolean} true si se eliminó correctamente
   */
  const eliminar = (clave, tipo = 'local') => {
    try {
      const storage = getStorage(tipo);
      storage.removeItem(clave);
      return true;
    } catch (error) {
      console.error(`[StorageUtil] Error al eliminar ${clave}: ${error.message}`);
      return false;
    }
  };

  /**
   * Lista todas las claves que coincidan con un prefijo dado.
   * @param {string} prefijo - Prefijo de búsqueda (opcional)
   * @param {'local'|'session'} tipo - Tipo de storage
   * @returns {string[]} Lista de claves encontradas
   */
  const listar = (prefijo = '', tipo = 'local') => {
    try {
      const storage = getStorage(tipo);
      const claves = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(prefijo)) claves.push(key);
      }
      return claves;
    } catch (error) {
      console.error(`[StorageUtil] Error al listar claves: ${error.message}`);
      return [];
    }
  };

  /**
   * Limpia completamente el storage especificado.
   *  Usar con precaución: elimina todos los datos del tipo indicado.
   * @param {'local'|'session'} tipo - Tipo de storage
   * @returns {boolean} true si se limpió correctamente
   */
  const limpiar = (tipo = 'local') => {
    try {
      const storage = getStorage(tipo);
      storage.clear();
      return true;
    } catch (error) {
      console.error(`[StorageUtil] Error al limpiar ${tipo}Storage: ${error.message}`);
      return false;
    }
  };

  /**
   * Verifica si una clave existe en el storage.
   * @param {string} clave - Clave a verificar
   * @param {'local'|'session'} tipo - Tipo de storage
   * @returns {boolean} true si la clave existe
   */
  const existe = (clave, tipo = 'local') => {
    try {
      const storage = getStorage(tipo);
      return storage.getItem(clave) !== null;
    } catch {
      return false;
    }
  };


  // -----------------------------
  // Exportación pública
  // -----------------------------
  return {
    guardar,
    obtener,
    actualizar,
    eliminar,
    listar,
    limpiar,
    existe,
  };
})();

// Export default para entornos con ES Modules
//export default StorageUtil;