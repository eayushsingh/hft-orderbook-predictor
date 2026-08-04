package com.hft.engine.util;

/**
 * A simple, zero-allocation open-addressing hash map for long keys.
 * Used to avoid the autoboxing penalties associated with java.util.HashMap&lt;Long, V&gt;.
 * Note: Assumes keys are strictly positive (0 and -1 are reserved for EMPTY and TOMBSTONE).
 */
public class LongObjectHashMap<V> {
    private static final long EMPTY = 0L;
    private static final long TOMBSTONE = -1L;

    private final long[] keys;
    private final V[] values;
    private int size;

    @SuppressWarnings("unchecked")
    public LongObjectHashMap(int capacity) {
        keys = new long[capacity];
        values = (V[]) new Object[capacity];
    }

    public void put(long key, V value) {
        if (key == EMPTY || key == TOMBSTONE) {
            throw new IllegalArgumentException("Invalid key (0 and -1 are reserved)");
        }
        int index = hash(key) % keys.length;
        
        while (keys[index] != EMPTY && keys[index] != TOMBSTONE && keys[index] != key) {
            index = (index + 1) % keys.length;
        }

        if (keys[index] != key) {
            size++;
        }
        keys[index] = key;
        values[index] = value;
    }

    public V get(long key) {
        if (key == EMPTY || key == TOMBSTONE) {
            return null;
        }
        int index = hash(key) % keys.length;

        while (keys[index] != EMPTY) {
            if (keys[index] == key) {
                return values[index];
            }
            index = (index + 1) % keys.length;
        }
        return null;
    }

    public void remove(long key) {
        if (key == EMPTY || key == TOMBSTONE) {
            return;
        }
        int index = hash(key) % keys.length;

        while (keys[index] != EMPTY) {
            if (keys[index] == key) {
                keys[index] = TOMBSTONE;
                values[index] = null;
                size--;
                return;
            }
            index = (index + 1) % keys.length;
        }
    }

    private int hash(long key) {
        int h = (int) (key ^ (key >>> 32));
        return (h & 0x7FFFFFFF); // Ensure positive index
    }

    public int size() {
        return size;
    }

    public long[] getKeys() {
        return keys;
    }
}
