const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();

module.exports = (io) => {
  const router = express.Router();

  router.post('/', authenticateToken, async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.id;

      if (!productId || !quantity) {
        return res.status(400).json({ error: 'Product ID and quantity are required' });
      }

      if (quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be greater than 0' });
      }

      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) }
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ 
          error: 'Insufficient stock', 
          availableStock: product.stock 
        });
      }

      const totalPrice = product.price * quantity;

      const result = await prisma.$transaction(async (prisma) => {
        const order = await prisma.order.create({
          data: {
            userId,
            productId: parseInt(productId),
            quantity: parseInt(quantity),
            totalPrice,
            status: 'confirmed'
          },
          include: {
            user: {
              select: { id: true, name: true, email: true }
            },
            product: {
              select: { id: true, name: true, price: true }
            }
          }
        });

        await prisma.product.update({
          where: { id: parseInt(productId) },
          data: {
            stock: {
              decrement: quantity
            }
          }
        });

        return order;
      });

      io.emit('new_order', {
        orderId: result.id,
        user: result.user,
        product: result.product,
        quantity: result.quantity,
        totalPrice: result.totalPrice,
        timestamp: result.createdAt
      });

      res.status(201).json({
        message: 'Order created successfully',
        order: result
      });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { status } = req.query;

      let where = { userId };
      if (status) {
        where.status = status;
      }

      const orders = await prisma.order.findMany({
        where,
        include: {
          product: {
            select: { id: true, name: true, price: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({
        orders,
        count: orders.length
      });
    } catch (error) {
      console.error('Orders fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/all', authenticateToken, async (req, res) => {
    try {
      const { status, userId } = req.query;

      let where = {};
      if (status) where.status = status;
      if (userId) where.userId = parseInt(userId);

      const orders = await prisma.order.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          product: {
            select: { id: true, name: true, price: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({
        orders,
        count: orders.length
      });
    } catch (error) {
      console.error('All orders fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const order = await prisma.order.findFirst({
        where: { 
          id: parseInt(id),
          userId 
        },
        include: {
          product: {
            select: { id: true, name: true, price: true }
          }
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({ order });
    } catch (error) {
      console.error('Order fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.put('/:id/status', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: 'Invalid status', 
          validStatuses 
        });
      }

      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) }
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(id) },
        data: { status },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          product: {
            select: { id: true, name: true, price: true }
          }
        }
      });

      io.emit('order_status_updated', {
        orderId: updatedOrder.id,
        newStatus: status,
        user: updatedOrder.user,
        product: updatedOrder.product
      });

      res.json({
        message: 'Order status updated successfully',
        order: updatedOrder
      });
    } catch (error) {
      console.error('Order status update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};