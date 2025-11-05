import {aj} from "../config/arcjet.js";
 
// Middleware de Arcjet para limitación de velocidad, protección contra bots y seguridad
 
export const arcjetMiddleware = async (req, res, next) => {
    try {
        const desicion = await aj.protect (req, {
            requested: 1, //cada solicitud cuenta o consume un tokend
       
        });
           
 
        if (desicion.isDenied()) {  
            if (desicion.reason.isRateLimited()) {
                return res.status(429).json({
                    error: "Demasiadas solicitudes",
                    message: "se ha superado el límite de solicitudes, intentelo más tarde."
                });
 
            } else if (desicion.reason.isBot()) {
                return res.status(403).json({
                    error: "acceso denegado",
                    message: "se ha detectado actividad sospechosa de bot."
                });
           
 
            } else {
                return res.status(403).json({
                    error: "acceso denegado",
                    message: "su solicitud ha sido bloqueada por razones de seguridad."
                });
            }
 
        }
        if (desicion.results.some((result) => result.reason.isBot()&& result.reason.isSpoofed)) {
            return res.status(403).json({
                error: "acceso denegado",
                message: "se ha detectado actividad sospechosa de bot ."
            });
        }
        next();
 
    }catch (error) {    
   
    }    
};    