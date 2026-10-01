package com.hft.engine.simulator;

import com.hft.engine.HFTNode;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

public class TickReplayEngineTest {

    @TempDir
    File tempDir;

    @Test
    public void testReplayCsvFile() throws IOException, InterruptedException {
        File csvFile = new File(tempDir, "sample_ticks.csv");
        try (FileWriter writer = new FileWriter(csvFile)) {
            writer.write("timestamp,side,price,quantity,orderId\n");
            writer.write("1700000000000,BUY,100000,50,1\n");
            writer.write("1700000000100,SELL,101000,30,2\n");
            writer.write("1700000000200,BUY,100050,40,3\n");
        }

        HFTNode node = new HFTNode(1024, 8889);
        node.start();

        TickReplayEngine replayEngine = new TickReplayEngine(node.getPublisher());
        long count = replayEngine.replayCsvFile(csvFile, 0); // max throughput speed

        assertEquals(3, count);
        node.stop();
    }
}
