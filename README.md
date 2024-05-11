# Online Shopping Store Microservice

This repository contains the source code for a microservice-based Online Shopping Store, which is part of an academic project focusing on secure microservice architectures and DevOps practices. This project is developed using the MERN stack (MongoDB, Express.js, React, and Node.js) and incorporates Docker for containerization, AWS for deployment, and GitHub Actions for CI/CD.

## Table of Contents

-   [Introduction](#introduction)
-   [Microservice Description](#microservice-description)
-   [Containerization](#containerization)
-   [DevOps Practices](#devops-practices)
-   [Security Measures](#security-measures)
-   [Challenges and Fixes](#challenges-and-fixes)
-   [IAM Role Configurations and GitHub Actions ECS](#iam-role-configurations-and-github-actions-ecs)
-   [Getting Started](#getting-started)

## Introduction

This project uses microservices to construct an adaptable and resilient application for an Online Shopping Store. It emphasizes the practical implementation of a microservice for managing product information and efficiently organizing products into categories using Prisma ORM for enhanced data management capabilities.

## Microservice Description

The Product Management microservice handles product and category management. It facilitates adding, retrieving, updating, and deleting products and categories, crucial for maintaining an organized catalog which enhances user experience and operational efficiency.

## Containerization

Our microservice is containerized using Docker, ensuring consistent environments across development, testing, and production. Dockerfiles are used to define the steps for creating Docker images of our microservice.

## DevOps Practices

We implement CI/CD pipelines using GitHub Actions, automating the development, testing, and deployment phases. The microservice is deployed on AWS using ECS, demonstrating cloud-based deployment and scalability.

## Security Measures

Security is a cornerstone of our application, involving:

-   AWS IAM roles for managing permissions.
-   Security groups as virtual firewalls.
-   Secrets management for sensitive information.
-   Integration of SAST tools like SonarCloud for continuous security and quality checks.

## Challenges and Fixes

We detail the challenges encountered during development, such as IAM role configurations and limitations of AWS's free tier, and describe the solutions implemented to overcome these issues.

## IAM Role Configurations and GitHub Actions ECS

### Role Changes

-   **GitHubActionsECS**:
    -   Removed `AmazonECSTaskExecutionRolePolicy`: Successful.
    -   Removed `AdministratorAccess`: Caused errors related to ECR access and Docker password exposure.
    -   Removed `AmazonECS_FullAccess`: Successful.

### Restricting Access

-   Created `GitHubActionsECSLimitedAccess` with policies allowing specific actions essential for our CI/CD pipeline, addressing the authorization issues encountered.

### Final Policy Adjustments

-   Added actions like `ecs:DescribeServices` and `ecr:InitiateLayerUpload` to fully support our deployment workflow.

## Getting Started

To get a local copy up and running follow these simple steps:

1. Clone the repo

    ```sh
    git clone https://github.com/AbishekPerera/ctse_micro_service.git

    ```

2. Navigate to the project directory and build the Docker container

    ```sh
    docker build -t online-shopping-store .

    ```

3. Run the Docker container
    ```sh
    docker run -p 4000:4000 online-shopping-store
    ```

For more detailed instructions, please refer to the individual directories and code comments within the repository.

### Authors

-   K.S.V Perera - CD part
-   J.B Mayadunna - CD part
-   A.S.A Perera - CI part
-   H.R.A.L.N Ranasinghe - CI part

This README.md provides a clear overview of your project, how to set it up locally, the structure of your microservices, security implementations, and the handling of IAM roles and GitHub Actions ECS for your CI/CD pipeline.
.
