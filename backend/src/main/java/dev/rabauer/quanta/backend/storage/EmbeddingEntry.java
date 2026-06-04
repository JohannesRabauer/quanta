package dev.rabauer.quanta.backend.storage;

public class EmbeddingEntry {

    private final String uuid;
    private final String filePath;
    private final float[] vector;

    public EmbeddingEntry(String uuid, String filePath, float[] vector) {
        this.uuid = uuid;
        this.filePath = filePath;
        this.vector = vector;
    }

    public String getUuid() {
        return uuid;
    }

    public String getFilePath() {
        return filePath;
    }

    public float[] getVector() {
        return vector;
    }
}
