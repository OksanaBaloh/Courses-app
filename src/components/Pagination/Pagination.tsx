import classNames from 'classnames';
import React from 'react';
import { getNumbers } from '../../utils';

type Props = {
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export const Pagination: React.FC<Props> = ({ total, currentPage, onPageChange }) => {
  const pageAmount = Math.ceil(total / 10);
  const pages = getNumbers(1, pageAmount);

  const equalFirst = currentPage === 1;
  const equalLast = currentPage === pageAmount;

  return (
    <ul className="pagination">
      <li className="pagination__item">
        <button
          type="button"
          className="button is-light pagination__link"
          disabled={equalFirst}
          onClick={() => {
            if (!equalFirst) {
              onPageChange(currentPage - 1);
            }
          }}
        >
          «
        </button>
      </li>

      {pages.map((page) => (
        <li className="pagination__item" key={page}>
          <button
            type="button"
            className={classNames('pagination__link', 'button', 'is-link', {
              'is-medium': page === currentPage,
              'is-active': page === currentPage
            })}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        </li>
      ))}

      <li className="pagination__item">
        <button
          type="button"
          className="button is-light pagination__link"
          disabled={equalLast}
          onClick={() => {
            if (!equalLast) {
              onPageChange(currentPage + 1);
            }
          }}
        >
          »
        </button>
      </li>
    </ul>
  );
};
