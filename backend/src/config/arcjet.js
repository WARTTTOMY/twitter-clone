import arcjet, { tokenBucket, shield, detectBot}    from "@arcjet/node";
import {ENV} from "../env.js";
 
//inicializar arcjet con roles de seguridad
 
export const aj = arcjet({
    key: ENV.ARJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        //Shield protege la aplicación de ataques comunes.
        shield({
            mode: "LIVE",
           
        }),
 
        //DETECCIÓN DE BOTS, BLOQUEAR TODOS LOS BOTS EXCEPTO LOS DE MOTOR DE BÚSQUEDA
        detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SHEARCH_ENGINE"
            ],
        }),
 
        tokenBucket({
            mode: "LIVE",
            refillRate: 10, //tokens por intervalo
            interval: 10, //intervalo de 10 segundos
            capacity: 15, //capacidad máxima de tokens
 
        }),
    ],
});