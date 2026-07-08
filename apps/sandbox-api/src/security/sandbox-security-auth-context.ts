import type {
  SecurityAuthResult
} from '@jarvis/security';

/**
 * Extiende los tipos nativos de Fastify para que Sandbox-API pueda adjuntar
 * información autenticada dentro del request.
 *
 * Esta declaración permite usar:
 *
 * request.auth
 *
 * dentro de rutas protegidas, preHandlers y otros puntos del ciclo HTTP.
 *
 * Importante:
 * Esta extensión pertenece a Sandbox-API porque es una adaptación específica
 * de Fastify. @jarvis/security se mantiene agnóstico del framework y solo
 * entrega un resultado universal mediante SecurityAuthResult.
 */
declare module 'fastify' {
  interface FastifyRequest {
    /**
     * Resultado de autenticación generado por @jarvis/security.
     *
     * Esta propiedad se asigna después de validar correctamente un header:
     *
     * Authorization: Bearer <token>
     *
     * Contiene el token original y el payload JWT verificado.
     *
     * Puede ser undefined porque las rutas públicas no ejecutan el preHandler
     * de autenticación.
     */
    auth?: SecurityAuthResult;
  }
}
