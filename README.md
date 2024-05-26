A Pastebain is a web application designed for storing and sharing plain text. Users can paste their text, set an expiration time, and receive a unique URL to share with others. This allows for easy and temporary sharing of information, facilitating collaboration and communication.

This repository contains the backend part of the Pastebain project. To view the frontend part, please click [here](https://github.com/saba1111111/Pastebian-frontend).

Ensure you have Docker and Docker Compose installed on your system. You can download and install them from the Docker and Docker Compose websites. First, copy the .env.example file and create a .env file by running cp .env.example .env. Open the newly created .env file, paste the contents from .env.example, and adjust any necessary environment variables. To run the project using Docker Compose, execute the command docker-compose up. This will start the application and all its required services in Docker containers.

Technical Overview
The server is built using Nest.js, with DynamoDB as the database and Redis for caching. Development and deployment are managed with Docker and Docker Compose, ensuring a consistent and isolated environment. All methods are unit tested using Jest.

Database and Caching
User content is stored in DynamoDB with Universally Unique Lexicographically Sortable IDs and an expiration date. There are two main access patterns for these items:

1.  Access by ID.
2.  Fetch expired items.

To support these patterns, the ID is used as the partition key and the expiration date (in milliseconds) as the sort key.

Expiration and Deletion
Each piece of content has a user-defined expiration time. After this time, the content becomes inaccessible. Expired content is deleted in two ways:

1. On access: If an expired content is accessed, it is deleted immediately.
2. Scheduled cleanup: A cron job iterates through the items in DynamoDB, using a nextPageToken stored in the cache for continuity. It fetches a batch of expired items and deletes them using a batch delete request. An exponential backoff algorithm is implemented to retry deletion requests in case of failure.

Performance Optimization
Popular items are stored in the cache to ensure fast access. Cache invalidation is implemented to maintain the validity of the cached data.

## Project Structure

```
src/
 |--content/        # Defines routes for content creation, fetching and sharing.

libs/
 |--content/        # Implements the business logic for content creation and sharing.
 |--cache/          # Manages caching mechanisms, including Redis connectivity and operations.
 |--common/         # Contains utilities and functionalities shared across various modules.
 |--database/       # Encapsulates the logic for database connections and interactions.

Dockerfile         # Multi staged docker file for nest.js server.
docker-compose.yml # Configuration file for running the DynamoDB, Redis, and NestJS services together.
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost/api` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

# Technologies Used

This project is built upon a robust stack of modern technologies, each chosen for its performance, scalability, and ease of integration. Below is a list of the key technologies employed:

NestJS: A progressive Node.js framework for building efficient and scalable server-side applications. NestJS is designed to be extensible and modular, making it ideal for enterprise-level projects. It provides a comprehensive suite of tools and supports TypeScript out of the box, facilitating the creation of maintainable and testable code.

DynamoDB: A fully managed NoSQL database service provided by AWS, known for its high performance and scalability. DynamoDB is designed to handle large amounts of data and traffic, making it suitable for applications that require low-latency data access. Its flexible data model and automatic scaling capabilities simplify database management and allow for dynamic workload adjustments.

Redis: An in-memory data structure store, used as a database, cache, and message broker. Redis is employed to enhance performance by caching frequently accessed data, reducing the load on primary databases, and providing fast data retrieval. It supports various data structures, such as strings, hashes, lists, sets, and sorted sets, enabling efficient data management.

Jest: A delightful JavaScript testing framework with a focus on simplicity. Jest is used for unit testing, ensuring code quality and reliability. It provides a robust testing environment with features like snapshot testing, mocking, and coverage reporting. Jest's integration with TypeScript and its ability to run tests in parallel make it a preferred choice for maintaining a healthy codebase.

Docker & Docker Compose: Docker is a platform for developing, shipping, and running applications in containers. Docker Compose is a tool for defining and running multi-container Docker applications. Together, they provide a consistent and isolated environment for development, testing, and deployment. Docker ensures that the application runs consistently across different environments, while Docker Compose simplifies the management of multi-container setups by allowing the definition of services, networks, and volumes in a single configuration file.
