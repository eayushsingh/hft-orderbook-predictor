package com.hft.engine.structure;

import com.hft.engine.model.Order;
import com.hft.engine.model.OrderType;
import com.hft.engine.model.Side;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class OrderBookStructureTest {

    @Test
    public void testDoublyLinkedListAddAndRemove() {
        DoublyLinkedList list = new DoublyLinkedList();
        assertTrue(list.isEmpty());
        assertEquals(0, list.getSize());

        Order order1 = new Order(1L, 1000L, 50L, System.currentTimeMillis(), Side.BUY, OrderType.LIMIT);
        Order order2 = new Order(2L, 1010L, 100L, System.currentTimeMillis(), Side.BUY, OrderType.LIMIT);
        Order order3 = new Order(3L, 990L, 20L, System.currentTimeMillis(), Side.BUY, OrderType.LIMIT);

        OrderNode node1 = new OrderNode(order1);
        OrderNode node2 = new OrderNode(order2);
        OrderNode node3 = new OrderNode(order3);

        // Test Append
        list.append(node1);
        assertEquals(1, list.getSize());
        assertEquals(node1, list.getHead());
        assertEquals(node1, list.getTail());

        list.append(node2);
        list.append(node3);
        assertEquals(3, list.getSize());
        assertEquals(node1, list.getHead());
        assertEquals(node3, list.getTail());

        // Test Remove Head
        list.remove(node1);
        assertEquals(2, list.getSize());
        assertEquals(node2, list.getHead());
        assertNull(node2.getPrev());
        assertEquals(node3, node2.getNext());

        // Test Remove Tail
        list.remove(node3);
        assertEquals(1, list.getSize());
        assertEquals(node2, list.getHead());
        assertEquals(node2, list.getTail());
        assertNull(node2.getNext());

        // Test Remove Remaining
        list.remove(node2);
        assertTrue(list.isEmpty());
        assertNull(list.getHead());
        assertNull(list.getTail());
    }
}
