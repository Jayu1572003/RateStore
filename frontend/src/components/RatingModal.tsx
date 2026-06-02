import React, { useState } from 'react';
import StarRating from './StarRating';
import api from '../lib/axios';
import { useToast } from '../contexts/ToastContext';

interface RatingModalProps {
  storeId: string;
  storeName: string;
  existingRating?: number | null;
  onSuccess: () => void;
  onClose: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  storeId,
  storeName,
  existingRating,
  onSuccess,
  onClose,
}) => {
  const { showToast } = useToast();
  const [ratingValue, setRatingValue] = useState<number>(existingRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingValue < 1 || ratingValue > 5) {
      setErrorMsg('Please select a rating between 1 and 5 stars');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (existingRating !== null && existingRating !== undefined) {
        // Edit existing rating
        await api.patch(`/ratings/${storeId}`, { value: ratingValue });
        showToast('Rating modified successfully', 'success');
      } else {
        // Submit new rating
        await api.post('/ratings', { storeId, value: ratingValue });
        showToast('Rating submitted successfully', 'success');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit rating';
      setErrorMsg(Array.isArray(msg) ? msg[0] : msg);
      showToast('Rating submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h3 className="font-display text-lg font-bold text-slate-900">
            {existingRating !== null && existingRating !== undefined ? 'Edit Rating' : 'Rate Store'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-500">How was your experience at</p>
            <h4 className="font-display text-xl font-bold text-slate-800 mt-1">{storeName}</h4>
            
            <div className="mt-6 flex justify-center">
              <StarRating value={ratingValue} onChange={setRatingValue} />
            </div>
            {ratingValue > 0 && (
              <p className="text-sm font-semibold text-amber-500 mt-2">
                {ratingValue} / 5 Stars
              </p>
            )}
          </div>

          {errorMsg && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 font-medium text-center">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || ratingValue === 0}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
