/*
Este archivo centraliza la importación de los repositorios y los exporta para que puedan ser utilizados en otros archivos.
*/

import CartRepository from "./CartsRepository.js";
import MessagesRepository from "./MessagesRepository.js";
import MockingProductsRepository from "./MockingProductsRepository.js";
import ProductsRepository from "./ProductsRepository.js";
import TicketsRepository from "./TicketsRepository.js";
import UsersRepository from "./UsersRepository.js";

export const UserServices = UsersRepository;
export const CartServices = CartRepository;
export const ProductsServices = ProductsRepository;
export const MessagesServices = MessagesRepository;
export const TicketsServices = TicketsRepository;
export const MockingProductsServices = MockingProductsRepository;
