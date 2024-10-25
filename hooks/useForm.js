import { useEffect, useState, useCallback, useMemo } from "react";

/**
 * @typedef {Object} ValidationRule
 * @property {function(any): boolean} check - Función validadora, debe devolver un booleano.
 * @property {string|string[]} message - Mensaje del error.
 * @property {string} equal - String referente a otra clave para comparar si son iguales.
 */

/**
 * @type {Object.<string, ValidationRule>}
 * Objeto que contiene reglas de validación para campos.
 * Las claves son los nombres de los campos, y los valores son objetos ValidationRule.
 */

/**
 * @typedef {Object} ValueReturn
 * @property {Object} form
 * @property {function(string, any): void} setForm - Función para actualizar el formulario.
 * @property {Object} errors
 * @property {function(): void} clear - Función usada para limpiar el formulario.
 * @property {function(Object): void} register - Función para setear formulario a cualquier valor.
 * @property {function(String): void} handleChange - Función para manejar inputs de tipo texto o que devuelvan un valor que se guarde sin editar.
 * @property {boolean} ready - Indica si el formulario está listo para ser enviado (no tiene errores y el estado es diferente de los valores iniciales).
 */

/**
 * Hook personalizado para manejar formularios con validaciones.
 *
 * @param {Object} options - Opciones para el hook.
 * @param {Object.<string, ValidationRule>} options.validations - Reglas de validación para campos del formulario.
 * @param {Object.<string, any>} options.initialValues - Valores iniciales del formulario.
 *
 * @returns {ValueReturn} - Un objeto que contiene el estado del formulario y las funciones para su manejo.
 */
const useForm = ({ validations = {}, initialValues = {} }) => {
  const [state, setState] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const memoizedValidations = useMemo(() => validations, [validations]);
  const memoizedInitialValues = useMemo(() => initialValues, [initialValues]);

  /**
   * @param {string} key - Clave para guardar en el formulario.
   * @param {any} value - Valor a guardar en el formulario.
   */
  const setForm = useCallback((key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clear = useCallback(() => {
    setState(memoizedInitialValues);
    setErrors({});
  }, [memoizedInitialValues]);

  const handleChange = (name) => (value) => setForm(name, value);

  useEffect(() => {
    const newErrors = {};

    Object.keys(memoizedValidations).forEach((key) => {
      const value = state[key];
      const validation = memoizedValidations[key];
      if (validation && value) {
        const isValid = validation.check(value);
        if (
          !isValid ||
          (validation.equal && state[validation.equal] !== value)
        ) {
          newErrors[key] = validation.message;
        }
      }
    });

    if (JSON.stringify(newErrors) !== JSON.stringify(errors)) {
      setErrors(newErrors);
    }
  }, [state, memoizedValidations, errors]);

  const register = useCallback((newState) => {
    setState(newState);
  }, []);

  // Calcular la propiedad 'ready'
  const ready = useMemo(() => {
    const noErrors = Object.keys(errors).length === 0;
    const stateChanged =
      JSON.stringify(state) !== JSON.stringify(memoizedInitialValues);
    return noErrors && stateChanged;
  }, [errors, state, memoizedInitialValues]);

  return {
    register,
    form: state,
    setForm,
    handleChange,
    errors,
    clear,
    ready,
  };
};

export default useForm;
