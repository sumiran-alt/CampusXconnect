"use client";

import { useEffect, useState } from "react";
import { connectionAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function ConnectionButton({ userId, onStatusChange }) {
  const { user } = useAuthStore();
  const [status, setStatus] = useState("not_connected");
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState(null);

  // Don't show button if viewing own profile
  if (user?.id === userId) {
    return null;
  }

  useEffect(() => {
    checkConnectionStatus();
  }, [userId]);

  const checkConnectionStatus = async () => {
    try {
      const response = await connectionAPI.checkConnectionStatus(userId);
      setStatus(response.data.status);

      if (response.data.sentRequestId) {
        setRequestId(response.data.sentRequestId);
      } else if (response.data.receivedRequestId) {
        setRequestId(response.data.receivedRequestId);
      }
    } catch (error) {
      console.error("Error checking connection status:", error);
    }
  };

  const handleSendRequest = async () => {
    try {
      setLoading(true);
      const response = await connectionAPI.sendRequest(userId);
      setStatus("request_sent");
      setRequestId(response.data.request._id);
      toast.success("Connection request sent!");
      if (onStatusChange) onStatusChange("request_sent");
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error(
        error.response?.data?.message || "Error sending connection request",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    try {
      setLoading(true);
      await connectionAPI.cancelRequest(requestId);
      setStatus("not_connected");
      setRequestId(null);
      toast.success("Connection request cancelled");
      if (onStatusChange) onStatusChange("not_connected");
    } catch (error) {
      console.error("Error cancelling request:", error);
      toast.error("Error cancelling connection request");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveConnection = async () => {
    if (confirm("Remove this connection?")) {
      try {
        setLoading(true);
        await connectionAPI.removeConnection(userId);
        setStatus("not_connected");
        setRequestId(null);
        toast.success("Connection removed");
        if (onStatusChange) onStatusChange("not_connected");
      } catch (error) {
        console.error("Error removing connection:", error);
        toast.error("Error removing connection");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {status === "connected" && (
        <button
          onClick={handleRemoveConnection}
          disabled={loading}
          className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium disabled:opacity-50"
        >
          {loading ? "Removing..." : "Remove Connection"}
        </button>
      )}

      {status === "not_connected" && (
        <button
          onClick={handleSendRequest}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Connection Request"}
        </button>
      )}

      {status === "request_sent" && (
        <button
          onClick={handleCancelRequest}
          disabled={loading}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium disabled:opacity-50"
        >
          {loading ? "Cancelling..." : "Pending - Cancel Request"}
        </button>
      )}
    </>
  );
}
