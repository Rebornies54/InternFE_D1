import React from 'react';
import { FOOD_LOG_DISPLAY } from '../../../../constants';
import './FoodLogDisplay.css';

const FoodLogDisplay = ({
  dailyFoodLog,
  currentPage,
  itemsPerPage,
  totalPages,
  editingLog,
  showEditModal,
  editQuantity,
  editCalories,
  onEditFoodEntry,
  onDeleteFoodEntry,
  onUpdateFoodEntry,
  onCloseEditModal,
  onIncreaseEditQuantity,
  onDecreaseEditQuantity,
  onEditQuantityChange,
  onPageChange,
  calculateEditCalories,
  formatDate
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = dailyFoodLog.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="food-log-display-wrapper">
      <div className="section-header">
        <h2 className="section-title">
          📝 {FOOD_LOG_DISPLAY.TITLE}
        </h2>
      </div>

      {/* Food Log Table/Cards */}
      <div className="food-log-table-container">
        {dailyFoodLog.length === 0 ? (
          <div className="no-logs">
            <div className="no-logs-icon">📝</div>
            <h3>{FOOD_LOG_DISPLAY.NO_LOGS.TITLE}</h3>
            <p>{FOOD_LOG_DISPLAY.NO_LOGS.MESSAGE}</p>
          </div>
        ) : (
          <>
            {/* Desktop/Tablet Table View */}
            <div className="table-view">
              <table className="food-log-table">
                <thead>
                  <tr>
                    <th>{FOOD_LOG_DISPLAY.TABLE.STT_HEADER}</th>
                    <th>{FOOD_LOG_DISPLAY.TABLE_HEADERS.FOOD_NAME}</th>
                    <th>{FOOD_LOG_DISPLAY.TABLE_HEADERS.QUANTITY}</th>
                    <th>{FOOD_LOG_DISPLAY.TABLE_HEADERS.CALORIES}</th>
                    <th>{FOOD_LOG_DISPLAY.TABLE.DATE_HEADER}</th>
                    <th>{FOOD_LOG_DISPLAY.TABLE_HEADERS.ACTIONS}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.map((log, index) => (
                    <tr key={log.id} className="log-row">
                      <td>{startIndex + index + 1}</td>
                      <td className="food-name-cell">
                        <div className="food-name-wrapper">
                          <span className="food-name">{log.food_name}</span>
                          <span className="food-category">({log.category_name})</span>
                        </div>
                      </td>
                      <td className="quantity-cell">
                        <span className="quantity-value">{log.quantity}</span>
                        <span className="quantity-unit">g</span>
                      </td>
                      <td className="calories-cell">
                        <span className="calories-value">{log.calories}</span>
                        <span className="calories-unit">cal</span>
                      </td>
                      <td className="date-cell">
                        {formatDate(log.log_date)}
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button
                            className="btn btn-edit"
                            onClick={() => onEditFoodEntry(log)}
                            title={FOOD_LOG_DISPLAY.BUTTONS.EDIT}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => onDeleteFoodEntry(log.id)}
                            title={FOOD_LOG_DISPLAY.BUTTONS.DELETE}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="card-view">
              {currentLogs.map((log, index) => (
                <div key={log.id} className="log-card">
                  <div className="card-header">
                    <div className="food-info">
                      <h4 className="food-name">{log.food_name}</h4>
                      <span className="food-category">{log.category_name}</span>
                    </div>
                    <div className="card-actions">
                      <button
                        className="btn btn-edit"
                        onClick={() => onEditFoodEntry(log)}
                        title={FOOD_LOG_DISPLAY.BUTTONS.EDIT}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => onDeleteFoodEntry(log.id)}
                        title={FOOD_LOG_DISPLAY.BUTTONS.DELETE}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="log-details">
                      <div className="detail-item">
                        <span className="detail-label">{FOOD_LOG_DISPLAY.TABLE_HEADERS.QUANTITY}:</span>
                        <span className="detail-value">{log.quantity}g</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">{FOOD_LOG_DISPLAY.TABLE_HEADERS.CALORIES}:</span>
                        <span className="detail-value">{log.calories} cal</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">{FOOD_LOG_DISPLAY.CARD.DATE_LABEL}</span>
                        <span className="detail-value">{formatDate(log.log_date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {dailyFoodLog.length > itemsPerPage && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← {FOOD_LOG_DISPLAY.PAGINATION.PREVIOUS}
          </button>

          <div className="page-numbers">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                className={`page-number ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
                onClick={() => page !== '...' && onPageChange(page)}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {FOOD_LOG_DISPLAY.PAGINATION.NEXT} →
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingLog && (
        <div className="modal-overlay" onClick={onCloseEditModal}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{FOOD_LOG_DISPLAY.MODAL.TITLE} {editingLog.food_name}</h3>
              <button className="close-btn" onClick={onCloseEditModal}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="edit-form">
                <div className="form-group">
                  <label>{FOOD_LOG_DISPLAY.MODAL.LABELS.QUANTITY}</label>
                  <div className="quantity-input-wrapper">
                    <button
                      type="button"
                      className="quantity-btn decrease"
                      onClick={onDecreaseEditQuantity}
                      disabled={editQuantity <= 10}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={editQuantity}
                      onChange={(e) => onEditQuantityChange(parseInt(e.target.value) || 0)}
                      min="0"
                      max="10000"
                      step="10"
                    />
                    <button
                      type="button"
                      className="quantity-btn increase"
                      onClick={onIncreaseEditQuantity}
                      disabled={editQuantity >= 10000}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>{FOOD_LOG_DISPLAY.MODAL.LABELS.CALORIES}</label>
                  <div className="calories-display">
                    <span className="calories-value">{editCalories}</span>
                    <span className="calories-unit">cal</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onCloseEditModal}>
                {FOOD_LOG_DISPLAY.BUTTONS.CANCEL}
              </button>
              <button className="btn btn-primary" onClick={onUpdateFoodEntry}>
                {FOOD_LOG_DISPLAY.BUTTONS.SAVE}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodLogDisplay;
