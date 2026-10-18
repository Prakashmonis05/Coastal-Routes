"use client";

import { useActionState } from "react";
import { loginAdminAction } from "@/app/actions/authActions";
import { Bus, Lock, User, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            name="username"
            type="text"
            required
            autoComplete="username"
            placeholder="admin"
            className="w-full pl-10 pr-3.5 py-2.5 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full pl-10 pr-3.5 py-2.5 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-xs transition disabled:opacity-50 text-sm mt-2"
      >
        <span>{isPending ? "Verifying Credentials..." : "Sign In to Admin"}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
