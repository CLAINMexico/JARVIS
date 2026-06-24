/**
 * Valor primitivo permitido dentro de la configuración.
 *
 * Estos son los valores simples que puede guardar J.A.R.V.I.S.
 * dentro de su configuración.
 */
export type ConfigPrimitiveValue = string | number | boolean | null;

/**
 * Valor permitido dentro de la configuración.
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
 * Permite representar estructuras anidadas como:
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
