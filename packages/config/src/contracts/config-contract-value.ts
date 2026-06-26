/**
 * Valor primitivo permitido dentro de la configuración.
 *
 * Representa los valores simples que puede almacenar J.A.R.V.I.S.
 * dentro de una estructura de configuración.
 */
export type ConfigPrimitiveValue = string | number | boolean | null;

/**
 * Valor permitido dentro de la configuración.
 *
 * Este tipo permite representar estructuras compatibles con JSON,
 * incluyendo objetos anidados y arreglos.
 *
 * Puede ser:
 * - Un valor primitivo.
 * - Un arreglo de valores de configuración.
 * - Un objeto anidado de configuración.
 */
export type ConfigValue = ConfigPrimitiveValue | ConfigValue[] | ConfigObject;

/**
 * Objeto de configuración.
 *
 * Permite representar estructuras anidadas como settings.json.
 *
 * Ejemplo:
 *
 * {
 *   app: {
 *     name: 'MyApp'
 *   }
 * }
 */
export interface ConfigObject {
  [key: string]: ConfigValue;
}
