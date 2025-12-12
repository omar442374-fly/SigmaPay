import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { getTransaction } from '../utils/storage';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { navigateTo } from '../utils/url';

function Receipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      // Use navigateTo instead of navigate for direct URL navigation
      navigateTo('login');
      return;
    }

    const tx = getTransaction(id);
    if (!tx) {
      // Use navigateTo instead of navigate for direct URL navigation
      navigateTo('transactions');
      return;
    }
    setTransaction(tx);
  }, [id, navigate]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add receipt content to PDF
    doc.setFontSize(20);
    doc.text('SIGMAPAY Receipt', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Transaction ID: ${transaction.id}`, 20, 40);
    doc.text(`Date: ${new Date(transaction.date).toLocaleString()}`, 20, 50);
    doc.text(`Recipient: ${transaction.recipient}`, 20, 60);
    doc.text(`Amount: $${transaction.amount.toFixed(2)}`, 20, 70);
    doc.text(`Category: ${transaction.category}`, 20, 80);
    doc.text(`Status: ${transaction.status}`, 20, 90);

    if (transaction.notes) {
      doc.text('Notes:', 20, 100);
      doc.text(transaction.notes, 20, 110);
    }

    // Save the PDF
    doc.save(`receipt-${transaction.id}.pdf`);
  };

  if (!transaction) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payment Receipt</h1>
          <p className="text-gray-600">Thank you for using SIGMAPAY</p>
        </div>

        <div className="border-t border-gray-200 py-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{transaction.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(transaction.date).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Recipient</dt>
              <dd className="mt-1 text-sm text-gray-900">{transaction.recipient}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Amount</dt>
              <dd className="mt-1 text-sm text-gray-900">${transaction.amount.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900">{transaction.category}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {transaction.status}
                </span>
              </dd>
            </div>
            {transaction.notes && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900">{transaction.notes}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="flex justify-center my-6">
          <QRCodeSVG
            value={`SIGMAPAY:${transaction.id}`}
            size={128}
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button onClick={handleDownloadPDF} className="btn-primary">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Receipt;