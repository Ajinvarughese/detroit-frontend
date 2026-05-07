// src/pages/SuspendedUser.jsx

import React from "react";
import { ShieldAlert, Mail, Phone, LogOut } from "lucide-react";
import { deleteUser, getUser } from "../hooks/LocalStorageUser";

const SuspendedUser = () => {
    console.log(getUser())
    const handleLogout = () => {
      const path = getUser().role == "BANK" ? "bank" : "applicant";
      deleteUser();
      window.location.replace(`/login/${path}`);
    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <ShieldAlert size={50} />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight">
            Account Suspended
          </h1>

          <p className="mt-3 text-red-100 text-lg">
            Your account has been temporarily suspended.
          </p>
        </div>

        {/* Content */}
        <div className="p-10">
          {/* Info Box */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-red-700 mb-3">
              Why am I seeing this?
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Your account access has been restricted by the platform
              administrator. This may happen due to policy violations,
              suspicious activity, incomplete verification, or administrative
              review.
            </p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">
                Access Restricted
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                You cannot access platform services while your account is
                suspended.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">
                Need Assistance?
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                Contact support or your administrator to request a review.
              </p>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Contact Support
            </h3>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="text-blue-600" size={18} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">
                    support@detroitfinance.com
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Phone className="text-green-600" size={18} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">+91 8089949054</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-105"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center text-sm text-gray-400">
            Detroit Sustainable Finance Platform
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspendedUser;
