package com.hft.engine.structure;

/**
 * A custom doubly linked list optimized for HFT use cases.
 * Provides O(1) time complexity for appending at the tail and removing specific nodes.
 */
public class DoublyLinkedList {
    private OrderNode head;
    private OrderNode tail;
    private int size;

    public DoublyLinkedList() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    /**
     * Appends an order node at the tail of the list in O(1) time.
     * @param node The node to append.
     */
    public void append(OrderNode node) {
        if (node == null) {
            return;
        }

        node.setNext(null);
        if (tail == null) {
            node.setPrev(null);
            head = node;
            tail = node;
        } else {
            node.setPrev(tail);
            tail.setNext(node);
            tail = node;
        }
        size++;
    }

    /**
     * Removes a specific order node from the list in O(1) time.
     * Assumes the node is already part of this list.
     * @param node The node to remove.
     */
    public void remove(OrderNode node) {
        if (node == null) {
            return;
        }

        OrderNode prev = node.getPrev();
        OrderNode next = node.getNext();

        if (prev != null) {
            prev.setNext(next);
        } else {
            // The node being removed was the head
            head = next;
        }

        if (next != null) {
            next.setPrev(prev);
        } else {
            // The node being removed was the tail
            tail = prev;
        }

        // Nullify references to assist GC / pool reuse
        node.setPrev(null);
        node.setNext(null);

        size--;
    }

    public OrderNode getHead() {
        return head;
    }

    public OrderNode getTail() {
        return tail;
    }

    public int getSize() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }
}
