import type { Product } from "../types"

export const products: Product[] = [
  {
    _id: "1",
    name: "Organic Apples",
    description: "Fresh organic apples from local farms",
    price: 2.99,
    oldPrice: 3.49,
    category: "fruits",
    image: "/placeholder.svg",
    featured: true
  },
  {
    _id: "2", 
    name: "Whole Grain Bread",
    description: "Freshly baked whole grain bread",
    price: 3.99,
    category: "bakery",
    image: "/placeholder.svg"
  },
  {
    _id: "3",
    name: "Free Range Eggs",
    description: "Organic free range eggs (dozen)",
    price: 4.99,
    category: "dairy",
    image: "/placeholder.svg",
    featured: true
  },
  {
    _id: "4",
    name: "Almond Milk",
    description: "Unsweetened almond milk 1L",
    price: 2.49,
    category: "dairy",
    image: "/placeholder.svg"
  },
  {
    _id: "5",
    name: "Organic Spinach",
    description: "Fresh organic spinach bunch",
    price: 1.99,
    category: "vegetables",
    image: "/placeholder.svg"
  },
  {
    _id: "6",
    name: "Grass-Fed Beef",
    description: "Premium grass-fed beef 500g",
    price: 8.99,
    oldPrice: 9.99,
    category: "meat",
    image: "/placeholder.svg"
  },
  {
    _id: "7",
    name: "Avocados",
    description: "Ripe Hass avocados",
    price: 1.49,
    category: "fruits",
    image: "/placeholder.svg"
  },
  {
    _id: "8",
    name: "Greek Yogurt",
    description: "Creamy Greek yogurt 500g",
    price: 3.49,
    category: "dairy",
    image: "/placeholder.svg"
  },
  {
    _id: "9",
    name: "Whole Chicken",
    description: "Free range whole chicken",
    price: 7.99,
    category: "meat",
    image: "/placeholder.svg"
  },
  {
    _id: "10",
    name: "Tomatoes",
    description: "Vine-ripened tomatoes",
    price: 2.29,
    category: "vegetables",
    image: "/placeholder.svg"
  },
  {
    _id: "11",
    name: "Cheddar Cheese",
    description: "Aged cheddar cheese 200g",
    price: 3.99,
    category: "dairy",
    image: "/placeholder.svg"
  },
  {
    _id: "12",
    name: "Bananas",
    description: "Organic bananas bunch",
    price: 1.29,
    category: "fruits",
    image: "/placeholder.svg"
  }
]
