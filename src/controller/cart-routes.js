import { Router } from "express";
import {
  CartServices,
  TicketsServices,
  UserServices,
} from "../repositories/Repositories.js";
import { onlyUsersAccess } from "../middlewares/permissions.js";
import {
  CartNotBuyError,
  CartNotCreatedError,
  CartNotFoundError,
  CartNotUpdatedError,
  InsufficientDataError,
  ProductCartNotDeletedError,
  TicketNotCreatedError,
  UserNotFoundError,
} from "../utils/CustomErrors.js";
const router = Router();

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    if (!cid) throw new InsufficientDataError("Cart", ["CartID"]);
    const data = await CartServices.getCartByID(cid);
    if (!data) throw new CartNotFoundError();

    res.status(200).send(data);
  } catch (error) {
    if (error instanceof CartNotFoundError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send("Error interno del servidor");
    }
  }
});

router.post("/carts", async (req, res) => {
  try {
    const newCartID = await CartServices.createNewcart();
    if (!newCartID) throw new CartNotCreatedError();
    res.status(201).send(`Carro ${newCartID} creado`);
  } catch (error) {
    if (error instanceof CartNotCreatedError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error.message);
    }
  }
});
router.post("/carts/:cid/products/:pid", onlyUsersAccess, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { cid, pid } = req.params;
    if (!quantity || !cid || !pid)
      throw new InsufficientDataError("product", [
        "quantity",
        "cartID",
        "ProductID",
      ]);
    const data = await CartServices.addToCart(cid, pid, quantity);
    res.status(201).send(data);
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error.message);
    }
  }
});

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

export default router;
//create a Tickets class
