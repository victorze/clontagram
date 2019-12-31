import React from 'react';
import { Link } from 'react-router-dom';

export default function Grid({ posts }) {
  const columns = posts.reduce((columns, post) => {
    const lastColumn = columns[columns.length - 1];

    if (lastColumn && lastColumn.length < 3) {
      lastColumn.push(post);
    } else {
      columns.push([post]);
    }

    return columns;
  }, []);

  return (
    <div>
      {columns.map((column, index) => {
        return (
          <div key={index} className="Grid__row">
            {column.map(post => <GridPhoto key={post._id} {...post} />)}
          </div>
        )
      })}
    </div>
  );
}

function GridPhoto({ _id, url, caption }) {
  return (
    <Link to={`/post/${_id}`} className="Grid__post">
      <img src={url} alt={caption} className="Grid__post-img"/>
    </Link>
  );
}
