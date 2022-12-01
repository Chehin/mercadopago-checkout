"use strict";
var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function(resolve) { resolve(value); }); }
    return new(P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }

        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }

        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import pool from '../database';
// const bcrypt = require('bcrypt');
const axios = require("axios");
class CheckoutController {
    constructor() {
            this.mercadoPagoUrl = "https://api.mercadopago.com/checkout";
        }
        // constructor(paymentService) {
        //     this.paymentService = paymentService; 
        //   }
        // ==================================================
        //     
        // ==================================================
    getMercadoPagoLink(req, res) {
            return __awaiter(this, void 0, void 0, function*() {
                const { name, price, unit, img } = req.body;
                console.log("req.body es : ", req.body);
                console.log("name es : ", name);
                console.log("price es : ", price);
                try {
                    const checkout = yield createPaymentMercadoPago(name, // nombre del producto o servicio
                        price, //precio del producto o servicio
                        unit, //cantidad que estamos vendiendo
                        img // imagen de referencia del producto o servicio
                    );
                    return res.redirect(checkout.init_point);
                    //si es exitoso los llevamos a la url de Mercado Pago
                    return res.json({ url: checkout.init_point });
                    // o si queres devolver la url al front 
                } catch (err) {
                    // si falla devolvemos un status 500
                    console.log("err es : ", err);
                    return res.status(500).json({
                        error: true,
                        msg: "Hubo un error con Mercado Pago"
                    });
                }
            });
        }
        // ==================================================
        //  Aqui recibimos las notificacinoes de MP
        // ==================================================
    webhook(req, res) {
        return __awaiter(this, void 0, void 0, function*() {
            if (req.method === "POST") {
                let body = "";
                req.on("data", chunk => {
                    body += chunk.toString();
                });
                req.on("end", () => {
                    console.log(body, "webhook response");
                    res.end("ok");
                });
            }
            return res.status(200);
        });
    }
}
const checkoutController = new CheckoutController;
exports.default = checkoutController;

function createPaymentMercadoPago(name, price, unit, img) {
    return __awaiter(this, void 0, void 0, function*() {
        const mercadoPagoUrl = "https://api.mercadopago.com/checkout";
        console.log("asa createPaymentMercadoPago");
        // recibimos las props que le mandamos desde el PaymentController
        const url = `${mercadoPagoUrl}/preferences?access_token=${process.env.MP_ACCESS_TOKEN_TEST}`;
        // url a la que vamos a hacer los requests
        const items = [{
            id: "1234",
            // id interno (del negocio) del item
            title: name,
            // nombre que viene de la prop que recibe del controller
            description: "Dispositivo movil de Tienda e-commerce",
            // descripción del producto
            picture_url: "https://courseit.com.ar/static/logo.png",
            // url de la imágen del producto
            category_id: "1234",
            // categoría interna del producto (del negocio)
            quantity: parseInt(unit),
            // cantidad, que tiene que ser un intiger
            currency_id: "ARS",
            // id de la moneda, que tiene que ser en ISO 4217
            unit_price: parseFloat(price)
                // el precio, que por su complejidad tiene que ser tipo FLOAT
        }];
        const preferences = {
            // declaramos las preferencias de pago
            items,
            // el array de objetos, items que declaramos más arriba
            external_reference: "referencia del negocio",
            // referencia para identificar la preferencia, puede ser practicamente cualquier valor
            payer: {
                // información del comprador, si estan en producción tienen que //traerlos del request
                //(al igual que hicimos con el precio del item) 
                name: "juan",
                surname: "chehin",
                email: "chehin238@gmail.com",
                // si estan en sandbox, aca tienen que poner el email de SU usuario de prueba
                phone: {
                    area_code: "3865",
                    number: "415369"
                },
                address: {
                    zip_code: "1111",
                    street_name: "False",
                    street_number: "123"
                }
            },
            payment_methods: {
                // declaramos el método de pago y sus restricciones
                excluded_payment_methods: [
                    // aca podemos excluir metodos de pagos, tengan en cuenta que es un array de objetos
                    {
                        id: "amex"
                    }
                ],
                excluded_payment_types: [{ id: "atm" }],
                // aca podemos excluir TIPOS de pagos, es un array de objetos
                installments: 6,
                // limite superior de cantidad de cuotas permitidas
                default_installments: 6
                    // la cantidad de cuotas que van a aparecer por defecto
            },
            back_urls: {
                // declaramos las urls de redireccionamiento
                success: "https://localhost:3000/success",
                // url que va a redireccionar si sale todo bien
                pending: "https://localhost:3000.com/pending",
                // url a la que va a redireccionar si decide pagar en efectivo por ejemplo
                failure: "https://localhost:3000.com/error"
                    // url a la que va a redireccionar si falla el pago
            },
            notification_url: "https://api-mercadopago-checkout.herokuapp.com/webhook",
            // declaramos nuestra url donde recibiremos las notificaciones
            auto_return: "approved"
                // si la compra es exitosa automaticamente redirige a "success" de back_urls
        };
        try {
            const request = yield axios.post(url, preferences, {
                // hacemos el POST a la url que declaramos arriba, con las preferencias
                headers: {
                    // y el header, que contiene content-Type
                    "Content-Type": "application/json"
                }
            });
            return request.data;
            // devolvemos la data que devuelve el POST
        } catch (e) {
            console.log(e);
            // mostramos error en caso de que falle el POST
        }
    });
}