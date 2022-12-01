"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const checkoutRoutes_1 = __importDefault(require("./routes/checkoutRoutes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        // this.app.set('port', process.env.PORT || 3000);
        this.app.set('port', 3000);
        // CORS
        // this.app.use(function(req, res, next) {
        //     console.log('req es : ', req);
        //     res.header("Access-Control-Allow-Origin: http://localhost", "*");
        //     // res.header("Access-Control-Allow-Origin", "localhost:4220");
        //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //     res.header("Access-Control-Allow-Methods", "POST, GET, PUT , DELETE, OPTIONS");
        //     next();
        //   });
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.static('public'));
    }
    // ==================================================
    //        RUTAS
    // ==================================================
    routes() {
        // ******* Configuracion de CORS ********
        // Creo una lista blanca
        // var listaBlanca = ['*']
        // // Creo la configuracion
        //   var configuracionCORS = {
        //     origin: function (req:any, res:any) {
        //       // console.log('req es : ', req);
        //       // console.log('listaBlanca.indexOf(req) es : ', listaBlanca.indexOf(req));
        //       // Pregunro si se encontro el valor ; -1 si no se encuentra dicho valor
        //       if (listaBlanca.indexOf(req) !== -1) {
        //         res(null, true)
        //       } else {
        //         res(new Error('Bloqueado por CORS'))
        //         return;
        //       }
        //     }
        //   }
        // this.app.use('/', cors(configuracionCORS),indexRoutes);
        this.app.use('/api/login', loginRoutes_1.default);
        this.app.use('/api/checkout', checkoutRoutes_1.default);
    }
    // ==================================================
    //   Inicio el servicio en el puerto 3000
    // ==================================================
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server en puerto', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
