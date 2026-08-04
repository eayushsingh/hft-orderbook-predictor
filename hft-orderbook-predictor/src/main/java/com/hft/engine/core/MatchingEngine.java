package com.hft.engine.core;

import com.hft.engine.model.Order;
import com.hft.engine.model.Side;
import com.hft.engine.structure.DoublyLinkedList;
import com.hft.engine.structure.OrderNode;

/**
 * The FIFO Matching Engine.
 * Matches incoming orders against the resting limit order book using Price-Time Priority.
 * Any unfilled portion of the order is subsequently added to the order book.
 */
public class MatchingEngine {
    private final OrderBook orderBook;

    public MatchingEngine(OrderBook orderBook) {
        this.orderBook = orderBook;
    }

    public void cancelOrder(long orderId) {
        orderBook.cancelOrder(orderId);
    }

    /**
     * Processes an incoming order, attempting to match it before resting the remainder.
     * @param incomingOrder The order to process.
     */
    public void process(Order incomingOrder) {
        if (incomingOrder.getSize() <= 0) {
            return;
        }

        if (incomingOrder.getSide() == Side.BUY) {
            matchBuyOrder(incomingOrder);
        } else {
            matchSellOrder(incomingOrder);
        }

        // If there is still unfilled quantity, rest it in the order book.
        if (incomingOrder.getSize() > 0) {
            orderBook.addOrder(incomingOrder);
        }
    }

    private void matchBuyOrder(Order buyOrder) {
        while (buyOrder.getSize() > 0) {
            long bestAskPrice = orderBook.getBestAskPrice();
            
            // If the book is empty on the ask side or the best ask is strictly greater than the limit buy price
            if (bestAskPrice == Long.MAX_VALUE || buyOrder.getPrice() < bestAskPrice) {
                break;
            }

            PriceLevel bestAskLevel = orderBook.getAskLevel(bestAskPrice);
            if (bestAskLevel == null) {
                // Defensive cleanup in case of desync
                orderBook.removeAskPrice(bestAskPrice);
                continue;
            }

            matchWithLevel(buyOrder, bestAskLevel);

            if (bestAskLevel.getVolume() == 0 && bestAskLevel.getOrders().isEmpty()) {
                orderBook.removeAskPrice(bestAskPrice);
            }
        }
    }

    private void matchSellOrder(Order sellOrder) {
        while (sellOrder.getSize() > 0) {
            long bestBidPrice = orderBook.getBestBidPrice();
            
            // If the book is empty on the bid side or the best bid is strictly lower than the limit sell price
            if (bestBidPrice == Long.MIN_VALUE || sellOrder.getPrice() > bestBidPrice) {
                break;
            }

            PriceLevel bestBidLevel = orderBook.getBidLevel(bestBidPrice);
            if (bestBidLevel == null) {
                // Defensive cleanup
                orderBook.removeBidPrice(bestBidPrice);
                continue;
            }

            matchWithLevel(sellOrder, bestBidLevel);

            if (bestBidLevel.getVolume() == 0 && bestBidLevel.getOrders().isEmpty()) {
                orderBook.removeBidPrice(bestBidPrice);
            }
        }
    }

    /**
     * Executes trades against a resting price level using FIFO priority.
     */
    private void matchWithLevel(Order incomingOrder, PriceLevel restingLevel) {
        DoublyLinkedList restingOrders = restingLevel.getOrders();
        OrderNode currentNode = restingOrders.getHead();

        while (currentNode != null && incomingOrder.getSize() > 0) {
            Order restingOrder = currentNode.getOrder();
            long matchSize = Math.min(incomingOrder.getSize(), restingOrder.getSize());

            // Fill sizes
            incomingOrder.setSize(incomingOrder.getSize() - matchSize);
            restingOrder.setSize(restingOrder.getSize() - matchSize);
            
            // Update the volume of the price level
            restingLevel.reduceVolume(matchSize);

            OrderNode nextNode = currentNode.getNext();

            // If the resting order is fully filled, remove it from the book entirely
            if (restingOrder.getSize() == 0) {
                orderBook.cancelOrder(restingOrder.getOrderId());
            }

            currentNode = nextNode;
        }
    }
}
