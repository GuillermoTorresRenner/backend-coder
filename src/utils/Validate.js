//Archivo de validaciones creado al inicio de l curso para verificar la unicidad de los datos y la presencia de propiedades requeridas.
//actualmente se encuentra en desuso.

class Validate {
  static unique(obj, list, propName) {
    const values = list.map((item) => item[propName]);
    const duplicate = values.find((val) => val === obj[propName]);

    if (duplicate !== undefined)
      throw new Error(`valor duplicado" ${propName}": ${duplicate}`);
  }

  static requiredProps(obj, props) {
    const objProps = Object.keys(obj);

    for (const prop of props) {
      if (Array.isArray(prop)) {
        const missingProps = prop.filter((item) => !objProps.includes(item));

        if (missingProps.length > 0) {
          throw new Error(
            `Propiedades requeridas no encontradas: ${missingProps.join(", ")}`
          );
        }
      } else {
        if (!objProps.includes(prop)) {
          throw new Error(`Propiedades requeridas no encontradas: ${prop}`);
        }
      }
    }
  }
}

export default Validate;
