import Link from "next/link";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-green-50 p-6 rounded-full mb-6">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Order Confirmed!
      </h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Thank you for shopping with Lyvera. We’ve received your payment via
        Pesapal and our team is already picking your items.
      </p>

      <div className="w-full max-w-md border rounded-xl p-6 bg-white shadow-sm mb-8 text-left">
        <h3 className="font-semibold mb-4 border-b pb-2">What happens next?</h3>
        <ul className="space-y-4">
          <li className="flex gap-3">
            <div className="bg-blue-100 p-2 rounded-lg h-fit">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Order Processing</p>
              <p className="text-xs text-gray-500">
                We are verifying your items (usually 1-2 hours).
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="bg-purple-100 p-2 rounded-lg h-fit">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Dispatch</p>
              <p className="text-xs text-gray-500">
                You will receive a WhatsApp message once your rider is on the
                way.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
        <Link
          href="https://wa.me/2547XXXXXXXX"
          className="border border-gray-300 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition"
        >
          Chat with Support
        </Link>
      </div>
    </div>
  );
}
