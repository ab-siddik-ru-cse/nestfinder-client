import Modal from '@/components/ui/Modal';
import { FiAlertTriangle } from 'react-icons/fi';

export default function RejectionFeedbackModal({ isOpen, onClose, feedback, propertyTitle }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rejection Feedback" size="sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <FiAlertTriangle className="text-red-500 w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{propertyTitle}</p>
          <p className="text-xs text-gray-400">This property was rejected by an admin</p>
        </div>
      </div>
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
        {feedback || 'No specific feedback was provided.'}
      </div>
    </Modal>
  );
}
