'use client';

import { useState } from 'react';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Modal, Spinner } from '@/components/ui';
import {
  useAdminGetAllComments,
  useAdminDeleteComment,
  useAdminSession,
  type AdminComment,
} from '@/hooks';

export default function AdminComments() {
  const { data: currentAdmin, isLoading: isLoadingSession } = useAdminSession();
  const [page, setPage] = useState(1);
  const [commentToDelete, setCommentToDelete] = useState<AdminComment | null>(
    null
  );

  const { data, isLoading } = useAdminGetAllComments(
    { page, limit: 12 },
    !!currentAdmin
  );

  const deleteCommentMutation = useAdminDeleteComment();

  const handleDeleteClick = (comment: AdminComment) => {
    setCommentToDelete(comment);
  };

  const handleConfirmDelete = () => {
    if (commentToDelete) {
      deleteCommentMutation.mutate(commentToDelete._id, {
        onSuccess: () => {
          setCommentToDelete(null);
        },
      });
    }
  };

  if (isLoadingSession || isLoading) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Comments Management</h1>
          <p>Manage all comments on the platform</p>
        </div>
        <div className="admin-section">
          <div className="admin-loading">
            <Spinner size="xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Comments Management</h1>
        <p>Manage all comments on the platform</p>
      </div>

      <div className="admin-section">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Commenter</th>
                <th>Post</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.comments.map(comment => (
                <tr key={comment._id}>
                  <td>
                    <div className="user-cell">
                      {comment.userId.avatarImage?.publicUrl ? (
                        <img
                          src={comment.userId.avatarImage.publicUrl}
                          alt={comment.userId.username}
                          className="user-avatar"
                        />
                      ) : (
                        <div className="user-avatar">
                          {comment.userId.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="user-name">{comment.userId.username}</p>
                        <p className="user-email">{comment.userId.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="user-cell">
                      {comment.postId.userId.avatarImage?.publicUrl ? (
                        <img
                          src={comment.postId.userId.avatarImage.publicUrl}
                          alt={comment.postId.userId.username}
                          className="user-avatar"
                        />
                      ) : (
                        <div className="user-avatar">
                          {comment.postId.userId.username
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="user-name">
                          {comment.postId.userId.username}
                        </p>
                        <p className="user-email">{comment.postId.title}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="comment-text">{comment.content}</p>
                  </td>
                  <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="admin-btn-icon"
                        onClick={() => handleDeleteClick(comment)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="admin-pagination">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="admin-btn-secondary"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <span className="admin-pagination-info">
              Page {page} of {data.totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="admin-btn-secondary"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        title="Delete Comment"
      >
        <div className="modal-content">
          <p>Are you sure you want to delete this comment?</p>
          <p className="modal-warning">This action cannot be undone.</p>
          <div className="modal-actions">
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              className="admin-btn-danger"
              disabled={deleteCommentMutation.isPending}
            >
              {deleteCommentMutation.isPending ? <Spinner size="sm" /> : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
