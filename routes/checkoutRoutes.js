"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
var mdAutenticacion = require('../middlewares/autenticacion');
const checkoutController_1 = __importDefault(require("../controllers/checkoutController"));
class CheckoutRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        // 
        // this.router.get('/datos-comprar-ahora/:pIdPersona/:pIdProducto',checkoutController.datosComprarAhora);
        // this.router.post('/confirmar-compra',checkoutController.confirmarCompra);
        // 
        this.router.post("/payment/new", checkoutController_1.default.getMercadoPagoLink);
        this.router.post("/webhook", checkoutController_1.default.webhook);
    }
}
const checkoutRoutes = new CheckoutRoutes();
exports.default = checkoutRoutes.router;
