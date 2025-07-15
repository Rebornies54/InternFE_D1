import React from 'react';
import './Blog.css';

const foodCards = [
  {
    title: "Potatoes",
    description: "Potatoes are very high in vitamin C, their skins are packed with fiber and, although they are higher....",
    image: ""
  },
  {
    title: "Vegetables", 
    description: "Vegetables are a great high-volume, low-calorie option....",
    image: ""
  },
  {
    title: "Mushrooms",
    description: "High in protein and low in calories, mushrooms that have been grown.....",
    image: ""
  },
  {
    title: "Title",
    description: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: ""
  },
  {
    title: "Title",
    description: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: ""
  },
  {
    title: "Title", 
    description: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: ""
  }
];

const FoodCard = ({ title, description }) => (
  <div className="blog-card">
    <div className="blog-card-image">
      <span>Image Placeholder</span>
    </div>
    <div className="blog-card-content">
      <h3 className="blog-card-title">{title}</h3>
      <p className="blog-card-desc">{description}</p>
    </div>
  </div>
);

const Blog = () => {
  return (
    <div className="blog-container">
      <h1 className="blog-title">Menu List • Healthy Eating Tips</h1>
      <div className="blog-card-grid">
        {foodCards.map((card, index) => (
          <FoodCard
            key={index}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Blog; 