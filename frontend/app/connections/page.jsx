"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { connectionAPI, userAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ConnectionsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState("requests"); // requests, sent, connections
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    fetchData();
  }, [isAuthenticated, router, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (activeTab === "requests") {
        const response = await connectionAPI.getPendingRequests();
        setPendingRequests(response.data.requests || []);
      } else if (activeTab === "sent") {
        const response = await connectionAPI.getSentRequests();
        setSentRequests(response.data.requests || []);
      } else if (activeTab === "connections") {
        const response = await connectionAPI.getMyConnections();
        setConnections(response.data.connections || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await connectionAPI.acceptRequest(requestId);
      toast.success("Connection request accepted!");
      fetchData();
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Error accepting connection request");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await connectionAPI.rejectRequest(requestId);
      toast.success("Connection request rejected");
      fetchData();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Error rejecting connection request");
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await connectionAPI.cancelRequest(requestId);
      toast.success("Connection request cancelled");
      fetchData();
    } catch (error) {
      console.error("Error cancelling request:", error);
      toast.error("Error cancelling connection request");
    }
  };

  const handleRemoveConnection = async (userId) => {
    if (confirm("Remove this connection?")) {
      try {
        await connectionAPI.removeConnection(userId);
        toast.success("Connection removed");
        fetchData();
      } catch (error) {
        console.error("Error removing connection:", error);
        toast.error("Error removing connection");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Connections</h1>
          <p className="text-gray-600 mt-2">Manage your network connections</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "requests"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center gap-2">
              Pending Requests
              {pendingRequests.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {pendingRequests.length}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "sent"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center gap-2">
              Sent Requests
              {sentRequests.length > 0 && (
                <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1">
                  {sentRequests.length}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("connections")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "connections"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center gap-2">
              My Connections
              {connections.length > 0 && (
                <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                  {connections.length}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Pending Requests Tab */}
            {activeTab === "requests" && (
              <div className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      No pending requests
                    </h3>
                    <p className="text-gray-600 mt-2">
                      You don't have any pending connection requests
                    </p>
                  </div>
                ) : (
                  pendingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Link href={`/profile/${request.from._id}`}>
                            <img
                              src={request.from.profilePicture}
                              alt={request.from.name}
                              className="w-16 h-16 rounded-full object-cover hover:opacity-80 transition cursor-pointer"
                            />
                          </Link>
                          <div>
                            <Link href={`/profile/${request.from._id}`}>
                              <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                                {request.from.name}
                              </h3>
                            </Link>
                            <p className="text-gray-600 text-sm">
                              {request.from.bio || "No bio"}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              Sent{" "}
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptRequest(request._id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request._id)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sent Requests Tab */}
            {activeTab === "sent" && (
              <div className="space-y-4">
                {sentRequests.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      No sent requests
                    </h3>
                    <p className="text-gray-600 mt-2">
                      You haven't sent any connection requests yet
                    </p>
                  </div>
                ) : (
                  sentRequests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Link href={`/profile/${request.to._id}`}>
                            <img
                              src={request.to.profilePicture}
                              alt={request.to.name}
                              className="w-16 h-16 rounded-full object-cover hover:opacity-80 transition cursor-pointer"
                            />
                          </Link>
                          <div>
                            <Link href={`/profile/${request.to._id}`}>
                              <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                                {request.to.name}
                              </h3>
                            </Link>
                            <p className="text-gray-600 text-sm">
                              {request.to.bio || "No bio"}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              Sent{" "}
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCancelRequest(request._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium text-sm"
                        >
                          Cancel Request
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Connections Tab */}
            {activeTab === "connections" && (
              <div>
                {connections.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      No connections yet
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Start connecting with other users to build your network
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {connections.map((connection) => (
                      <div
                        key={connection._id}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                      >
                        <Link href={`/profile/${connection._id}`}>
                          <div className="cursor-pointer">
                            <img
                              src={connection.profilePicture}
                              alt={connection.name}
                              className="w-full h-48 object-cover hover:opacity-80 transition"
                            />
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                                {connection.name}
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">
                                {connection.bio || "No bio"}
                              </p>
                              <p className="text-gray-500 text-xs mt-2">
                                {connection.college}
                              </p>
                            </div>
                          </div>
                        </Link>
                        <div className="px-4 pb-4 border-t">
                          <button
                            onClick={() =>
                              handleRemoveConnection(connection._id)
                            }
                            className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm"
                          >
                            Remove Connection
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
