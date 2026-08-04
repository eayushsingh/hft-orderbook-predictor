package com.hft.engine.structure;

import com.hft.engine.model.Order;

/**
 * Represents a node in the doubly linked list, specifically designed for holding Order objects.
 */
public class OrderNode {
    private Order order;
    private OrderNode prev;
    private OrderNode next;

    public OrderNode(Order order) {
        this.order = order;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public OrderNode getPrev() {
        return prev;
    }

    public void setPrev(OrderNode prev) {
        this.prev = prev;
    }

    public OrderNode getNext() {
        return next;
    }

    public void setNext(OrderNode next) {
        this.next = next;
    }
}
