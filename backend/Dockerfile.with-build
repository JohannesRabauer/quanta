# Stage 1: Build the Quarkus application
FROM maven:3.9.11-eclipse-temurin-25 AS build

# Set working directory
WORKDIR /app

COPY pom.xml .
COPY src ./src

# Package the application
RUN mvn package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:25_36-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built Quarkus application from the previous stage
COPY --from=build /app/target/quarkus-app/lib/ /app/lib/
COPY --from=build /app/target/quarkus-app/*.jar /app/
COPY --from=build /app/target/quarkus-app/app/ /app/app/
COPY --from=build /app/target/quarkus-app/quarkus/ /app/quarkus/

# Expose port
EXPOSE 8080

# Run the Quarkus application
CMD ["java", "-jar", "quarkus-run.jar"]
