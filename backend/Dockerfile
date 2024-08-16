# Step 1: Build the application using Gradle
FROM eclipse-temurin:17.0.11_9-jdk-jammy AS build

# Set the working directory
WORKDIR /app

# Copy the Gradle wrapper and project files
COPY ./gradlew /app/gradlew
COPY ./gradle /app/gradle
COPY ./build.gradle settings.gradle /app/

RUN chmod +x /app/gradlew
# Download the dependencies
RUN ./gradlew build -x test > /dev/null 2>&1 || true

# Copy the project files
COPY src /app/src
COPY checkstyle /app/checkstyle

# Build the application
RUN ./gradlew build

# Step 2: Create the final image
FROM eclipse-temurin:17.0.11_9-jdk-jammy

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
