/**
 * Este archivo contiene las rutas de los carritos, en este archivo se encuentran las rutas para:
 * - Obtener un carrito por ID
 * - Crear un carrito
 * - Agregar un producto a un carrito
 * - Eliminar un producto de un carrito
 * - Eliminar un carrito
 * - Actualizar un carrito
 * - Actualizar un producto de un carrito
 * - Comprar un carrito
 * - Comprar un carrito y enviar un email al usuario con el detalle de la compra
 * - Comprar un carrito y enviar un email al usuario con el detalle de la compra, eliminar el carrito actual del usuario y agregar el carrito comprado a la lista de carritos antiguos del usuario.
 * Se modificaron los métodos para que no sea necesario pasar el CID, puesto que al haber creado un campo vinculante en el model
 * de user, puedo obtener el CID directamente del registro del usuario a través de SessionID, de este modo no sólo es más fácil
 * ubicar el carrito de un usuario, sino que cada usuario puede tener un sólo carrito activo.
 * Se agregaron nuevas funcionalidades para enviar un email al usuario con el detalle de la compra, eliminar el carrito actual del usuario
 * y agregar el carrito comprado a la lista de carritos antiguos del usuario.
 */

import { Router } from "express";
import {
  CartServices,
  TicketsServices,
  UserServices,
  ProductsServices,
} from "../repositories/Repositories.js";
import {
  onlyAdminOrPremiumAccess,
  onlyPremiumOrUserAccess,
  onlyUsersAccess,
} from "../middlewares/permissions.js";
import {
  CartNotBuyError,
  CartNotFoundError,
  CartNotUpdatedError,
  InsufficientDataError,
  ProductCartNotDeletedError,
  TicketNotCreatedError,
  UserNotFoundError,
  AuthorizationError,
} from "../utils/CustomErrors.js";
import NodeMailer from "../utils/NodeMailer.js";
import UsersRepository from "../repositories/UsersRepository.js";
const router = Router();

/**
 
 * Se modifica este método de la versión anterior, donde no es necesario el envío del CID, puesto que se obtiene
 *  el ID del usuario de la sesión.
 *
 */
router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    if (!cid) {
      throw new InsufficientDataError("Cart", ["CartID"]);
    }
    const data = await CartServices.getCartByID(cid);
    if (!data) {
      throw new CartNotFoundError();
    }

    res.status(200).send(data);
  } catch (error) {
    if (
      error instanceof CartNotFoundError ||
      error instanceof InsufficientDataError
    ) {
      const errorData = error.getErrorData();
      res.status(errorData.status).send(errorData.message);
    } else {
      res.status(404).send("Error interno del servidor");
    }
  }
});

/*
 Se modifica este método para que no sea necesario pasar el CID, puesto que al haber creado un campo vinculante en el model
*Versión usada en el frontend */
router.get("/cart", async (req, res) => {
  try {
    const uid = req.session.userId;
    const cid = await UserServices.getCartIDByUserID(uid);

    if (!cid) {
      throw new InsufficientDataError("Cart", ["CartID"]);
    }
    const data = await CartServices.getCartByID(cid);
    if (!data) {
      throw new CartNotFoundError();
    }

    res.status(200).send(data);
  } catch (error) {
    if (
      error instanceof CartNotFoundError ||
      error instanceof InsufficientDataError
    ) {
      const errorData = err.getErrorData();
      res.status(errorData.status).send(errorData.message);
    } else {
      res.status(404).send("Error interno del servidor");
    }
  }
});

//----------------------------------------------------------------------
/**
 * Este método decidí no usarlo en el proyecto, ya que no tiene sentido crear un carrito vacío y no vincularlo a un usuario.
 */
// router.post("/carts", async (req, res) => {
//   try {
//     const userId = req.session.userId;
//     const newCartID = await CartServices.createNewcart(userId);
//     if (!newCartID) throw new CartNotCreatedError();
//     res.status(201).send(newCartID);
//   } catch (error) {
//     if (error instanceof CartNotCreatedError) {
//       res.status(error.statusCode).send(error.getErrorData());
//     } else {
//       res.status(500).send(error.message);
//     }
//   }
// });
//----------------------------------------------------------------------

/**
 *
 * Decidí modificar este método para que no sea necesario pasar el CID, puesto que al haber creado un campo vinculante en el model
 * de user, puedo obtener el CID directamente del registro del usuario a través de SessionID, de este modo no sólo es más fácil
 * ubicar el carrito de un usuario, sino que cada usuario puede tener un sólo carrito activo.
 */
router.post(
  "/carts/:cid/products/:pid",
  onlyAdminOrPremiumAccess,
  async (req, res) => {
    try {
      const { quantity } = req.body;
      const { cid, pid } = req.params;
      if (!quantity || !cid || !pid)
        throw new InsufficientDataError("product", [
          "quantity",
          "cartID",
          "ProductID",
        ]);
      const productOwner = await ProductsServices.getProductOwnerById(pid);
      if (
        req.usersRole === "PREMIUM" &&
        req.usersEmail === productOwner.owner
      ) {
        throw new AuthorizationError();
      } else {
        const data = await CartServices.addToCart(cid, pid, quantity);
        res.status(201).send(data);
      }
    } catch (error) {
      if (error instanceof InsufficientDataError) {
        res.status(error.statusCode).send(error.getErrorData());
      } else {
        res.status(500).send(error.message);
      }
    }
  }
);

/*
 *Versión usada en el frontend 
 
 método para agregar un producto al carrito, se modifica para que no sea necesario pasar el CID, puesto que al haber creado un campo vinculante en el model
 */
router.post("/cart", onlyPremiumOrUserAccess, async (req, res) => {
  try {
    const { pid, quantity } = req.query;
    const uid = req.session.userId;
    const cid = await UserServices.getCartIDByUserID(uid);
    if (!quantity || !pid)
      throw new InsufficientDataError("product", ["quantity", "ProductID"]);
    const productOwner = await ProductsServices.getProductOwnerById(pid);
    if (req.usersRole === "PREMIUM" && req.usersEmail === productOwner.owner) {
      throw new AuthorizationError();
    } else {
      if (!cid) {
        const newCart = await CartServices.createNewcart();
        await UserServices.addCartToUser(uid, newCart._id);
        const data = await CartServices.addToCart(newCart._id, pid, quantity);
        res.status(201).send(data);
      } else {
        const data = await CartServices.addToCart(cid, pid, quantity);
        res.status(201).send(data);
      }
    }
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error.message);
    }
  }
});

/**
 * método para eliminar un producto del carrito, se modifica para que no sea necesario pasar el CID, puesto que al haber creado un campo vinculante en el model
 * Se modifica este método para que no sea necesario pasar el CID, puesto que al haber creado un campo vinculante en el model
 */
router.delete("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (!cid || !pid)
      throw new InsufficientDataError("Cart", ["cartID", "ProductID"]);
    const data = await CartServices.deleteCartProductByID(cid, pid);
    if (!data) throw new ProductCartNotDeletedError();
    res.send(data);
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else if (error instanceof ProductCartNotDeletedError) {
      res.status(error.statusCode).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

/**Versión usada en el frontend
 * método para eliminar un producto del carrito, se modifica para que no sea necesario pasar el CID, puesto que al haber creado un campo vinculante en el model
 */
router.delete("/cart/product/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const uid = req.session.userId;
    const cid = await UserServices.getCartIDByUserID(uid);
    if (!pid) throw new InsufficientDataError("Cart", ["ProductID"]);
    const data = await CartServices.deleteCartProductByID(cid, pid);
    if (!data) throw new ProductCartNotDeletedError();
    res.send(data);
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else if (error instanceof ProductCartNotDeletedError) {
      res.status(error.statusCode).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

/**
 * método para eliminar un carrito, se modifica para que no sea necesario pasar el CID, puesto que al haber creado un campo vinculante en el model
 * de user, puedo obtener el CID directamente del registro del usuario a través de SessionID, de este modo no sólo es más fácil
 * ubicar el carrito de un usuario, sino que cada usuario puede tener un sólo carrito activo.
 * */
router.delete("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    if (!cid) throw new InsufficientDataError("Cart", ["CartID"]);
    await CartServices.deleteCartByID(cid);
    res.send(`cart ${cid} was deleted successfully`);
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error.message);
    }
  }
});

/**
 * método para actualizar un carrito, se modifica para que no sea necesario pasar el CID, puesto que al haber creado un campo vinculante en el model
 * de user, puedo obtener el CID directamente del registro del usuario a través de SessionID, de este modo no sólo es más fácil
 * ubicar el carrito de un usuario, sino que cada usuario puede tener un sólo carrito activo.
 * */
router.put("/carts/:cid", onlyUsersAccess, async (req, res) => {
  try {
    const { products } = req.body;
    const { cid } = req.params;

    if (!products || !cid)
      throw InsufficientDataError("product", ["array of products", "CartID"]);

    const updatedCart = await CartServices.updateCartByID(cid, products);
    if (!updatedCart) throw CartNotUpdatedError();
    res.send(updatedCart);
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else if (error instanceof CartNotUpdatedError) {
      res.status(error.statusCode).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

/**
 * método para actualizar un producto de un carrito, se modifica para que no sea necesario pasar el CID, puesto que al haber creado un campo vinculante en el model
 * de user, puedo obtener el CID directamente del registro del usuario a través de SessionID, de este modo no sólo es más fácil
 * ubicar el carrito de un usuario, sino que cada usuario puede tener un sólo carrito activo.
 * */
router.put("/carts/:cid/products/:pid", onlyUsersAccess, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (!cid || !pid || !quantity)
      throw new InsufficientDataError("cart", [
        "CartID",
        "ProductID",
        "Quantity",
      ]);
    const updatedCart = await CartServices.updateCartProductsByID(
      cid,
      pid,
      quantity
    );
    if (!updatedCart) throw CartNotFoundError();
    res.send(updatedCart);
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else if (error instanceof CartNotUpdatedError) {
      res.status(error.statusCode).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

/**
 * método para comprar un carrito, se modifica para que no sea necesario pasar el CID, puesto que al haber creado un campo vinculante en el model
 */
router.post("/carts/:cid/purchase", async (req, res) => {
  try {
    const { cid } = req.params;
    if (!cid) throw new InsufficientDataError("cart", ["CartID"]);
    const transaction = await CartServices.purchase(cid);
    if (!transaction) throw new CartNotBuyError();
    const userId = req.session.userId;
    const user = await UserServices.getUserByID(userId);
    if (!user) throw UserNotFoundError();
    const ticketData = {
      amount: transaction.amount,
      purchaser: user.email,
    };
    let ticket = await TicketsServices.createNewTicket(ticketData);
    if (!ticket) throw TicketNotCreatedError();

    if (transaction.leftiesCart) {
      ticket = { ...ticket._doc, productsOutOfStock: transaction.leftiesCart };
    }

    res.status(200).send(ticket);
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else if (error instanceof UserNotFoundError) {
      res.status(error.statusCode).send(error.message);
    } else if (error instanceof CartNotBuyError) {
      res.status(error.statusCode).send(error.message);
    } else if (error instanceof TicketNotCreatedError) {
      res.status(error.statusCode).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

/**Versión usada en el frontend
 * método para comprar un carrito, se modifica para que no sea necesario pasar el CID, puesto que al haber creado un campo vinculante en el model
 * de user, puedo obtener el CID directamente del registro del usuario a través de SessionID, de este modo no sólo es más fácil
 * ubicar el carrito de un usuario, sino que cada usuario puede tener un sólo carrito activo.
 * Se agregaron nuevas funcionalidades para enviar un email al usuario con el detalle de la compra, eliminar el carrito actual del usuario
 * y agregar el carrito comprado a la lista de carritos antiguos del usuario.
 *
 */
router.post("/cart/purchase", async (req, res) => {
  try {
    const uid = req.session.userId;
    const email = await UserServices.getusersEmailById(uid);
    const cid = await UserServices.getCartIDByUserID(uid);
    const cart = await CartServices.getCartByID(cid);
    if (!cid) throw new InsufficientDataError("cart", ["CartID"]);
    const transaction = await CartServices.purchase(cid);
    if (!transaction) throw new CartNotBuyError();
    const userId = req.session.userId;
    const user = await UserServices.getUserByID(userId);
    if (!user) throw UserNotFoundError();
    const ticketData = {
      amount: transaction.amount,
      purchaser: user.email,
    };
    let ticket = await TicketsServices.createNewTicket(ticketData);
    if (!ticket) throw TicketNotCreatedError();

    if (transaction.leftiesCart) {
      ticket = { ...ticket._doc, productsOutOfStock: transaction.leftiesCart };
    }

    //Agregar el carrito comprado a la lista de carritos antiguos del usuario
    await UsersRepository.moveCartToOldCarts(uid, cid);
    //Eliminar el carrito actual del usuario
    await UserServices.removeCartToUser(uid);
    //Enviar email al usuario con el detalle de la compra
    NodeMailer.sendMail({
      from: "Infuzion",
      to: email.email,
      subject: "Compra realizada en Infuzion Market",
      html: `<p> !Hola ${user.first_name} Gracias por tu compra <strong>#${
        ticket.code
      }</strong> en Infuzion Market!</p>
      <p>Detalle de la compra:</p>
      <br/>
      <ul>
      ${cart.products.map(
        (product) =>
          `<li>${product.productId.title} - ${product.quantity} unidad(es) - $${product.productId.price} </li>`
      )}
      </ul>,
      <br/>
      <h2>Total de la compra: $${transaction.amount}</h2>
      <br/>
      <p>Gracias por comprar en Infuzion Market, pronto te contactaremos para confirmarte la fecha de despacho!</p>`,
    });

    res.status(200).send(ticket);
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else if (error instanceof UserNotFoundError) {
      res.status(error.statusCode).send(error.message);
    } else if (error instanceof CartNotBuyError) {
      res.status(error.statusCode).send(error.message);
    } else if (error instanceof TicketNotCreatedError) {
      res.status(error.statusCode).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

export default router;
