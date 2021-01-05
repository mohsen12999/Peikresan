import React from "react";
import { Link } from "react-router-dom";

import { IBadge } from "../shares/Interfaces";
import "./ScrollbarBadge.css";

interface IScrollbarBadgeProps {
  badges: IBadge[];
}

const ScrollbarBadge: React.FC<IScrollbarBadgeProps> = ({ badges }) => (
  <section className="scrollbar-badge">
    {badges.map((badge) => (
      <Link to={badge.url} key={badge.id}>
        <span className="text-badge">{badge.text}</span>
      </Link>
    ))}
  </section>
);

export default ScrollbarBadge;
