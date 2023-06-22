# Interview Project - Running Instructions

## Description

This project is a part of the interview process for Burningbros company, by Ho Tan Binh. It is developed using React and npm is used for managing the dependencies.

## Installation

To install the required dependencies, run the following command:

### `npm install`

This command will download and install the dependencies listed in the package.json file.

## Getting Started

After successfully installing the dependencies, you can start the project by running the following command:

### `npm start`

This command will start a development server and open the application in a web browser. You can access the application at[http://localhost:3000](http://localhost:3000)

# Testing Scenarios

## Infinite Scroll:

- Scroll down the product list and verify that additional products are loaded automatically.
- Scroll up and down multiple times to ensure smooth and seamless scrolling experience.

## Product Search:

- Enter a search query in the search input field and verify that the relevant products are displayed.
- Verify that the search results update dynamically as the user types after 500ms.

## Combination Testing:

- Perform a product search and then scroll down to load more products.
- Verify that the search results are retained and additional products are appended to the existing list.

## Error Handling:

- Test scenarios where the search query returns no results.
- Check for errors by setting the network to offline.
