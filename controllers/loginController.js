"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
const database_1 = __importDefault(require("../database"));
class LoginController {
    // ========================================================
    // Login - usuario del sistema
    // ========================================================
    loginUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body[0];
            const pass = req.body[1];
            // 
            database_1.default.query(`call bsp_login_usuario('${email}')`, function (err, resultLogin) {
                var menu = [];
                if (err) {
                    res.status(401).json({
                        ok: true,
                        mensaje: 'Error de credenciales'
                    });
                }
                // Chequeo la contraseña
                bcrypt.compare(pass, resultLogin[0][0].lPassword, function (err, result) {
                    if (result != true || err) {
                        res.status(500).json({
                            ok: true,
                            mensaje: 'Ocurrio un problema, contactese con el administrador'
                        });
                        return;
                    }
                    else {
                        // Creo el token
                        var token = jwt.sign({ usuario: email }, SEED, { expiresIn: 14400 });
                        menu = resultLogin[1];
                        // Respuesta
                        res.status(200).json({
                            ok: true,
                            usuario: resultLogin[0][0].lUsuario,
                            IdRol: resultLogin[0][0].lIdRol,
                            token: token,
                            IdPersona: resultLogin[0][0].lIdPersona,
                            menu: menu
                        });
                    }
                });
            });
        });
    }
    // ========================================================
    // Login - clientes
    // ========================================================
    loginCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body[0];
            const pass = req.body[1];
            // 
            database_1.default.query(`call bsp_login_cliente('${email}')`, function (err, resultLogin) {
                if (err) {
                    res.status(401).json({
                        ok: true,
                        mensaje: 'Error de credenciales'
                    });
                    return;
                }
                // Chequeo la contraseña
                bcrypt.compare(pass, resultLogin[0][0].lPassword, function (err, result) {
                    if (result != true) {
                        res.status(500).json({
                            ok: true,
                            mensaje: 'Ocurrio un problema, contactese con el administrador'
                        });
                        return;
                    }
                    else {
                        // Creo el token
                        var token = jwt.sign({ usuario: email }, SEED, { expiresIn: 14400 });
                        // Respuesta
                        res.status(200).json({
                            ok: true,
                            token: token,
                            IdPersona: resultLogin[0][0].lIdPersona,
                            cantItemsCarrito: resultLogin[1][0].cantItemsCarrito
                        });
                    }
                });
            });
        });
    }
    // ==========================================
    //  Renueva TOKEN
    // ==========================================
    renuevatoken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var body = req.body; // Usuario y contraseña
            var token = jwt.sign({ usuario: body.correo }, SEED, { expiresIn: 14400 }); // 4 horas
            res.status(200).json({
                ok: true,
                token: token
            });
        });
    }
    // ==================================================
    //   Actualiza el estado de un cliente
    // ==================================================
    actualizaEstadoCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const IdPersona = req.params.IdPersona;
        });
    }
}
const loginController = new LoginController;
exports.default = loginController;
