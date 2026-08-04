# Stage 1: Build the Maven Project
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source and build Fat JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Runtime Image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the generated Fat JAR from the builder stage
COPY --from=builder /app/target/*-jar-with-dependencies.jar app.jar

# Expose WebSocket port
EXPOSE 8887

# Execute the application
ENTRYPOINT ["java", "-jar", "app.jar"]
