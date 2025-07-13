"use client";

import { useEffect, useState } from "react";
import {
  Loader,
  Trash,
  CheckCircle,
  Hammer,
  MessageCircle,
  ThumbsUp,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminHeader from "@/components/AdminHeader";

type Comment = {
  text: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
};

type Media = {
  url: string;
  filename: string;
  mimetype: string;
};

type Issue = {
  _id: string;
  title: string;
  description: string;
  category: string;
  pin: string;
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
  upvotes: number;
  comments: Comment[];
  user: {
    name: string;
    email: string;
  };
  media?: Media;
  lat?: number;
  lng?: number;
};

export default function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinFilter, setPinFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);

  const fetchIssues = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/issues");
    if (res.status === 401) {
      toast.error("Unauthorized: Admins only");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setIssues(data);
    setFilteredIssues(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/issues/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success("Status updated");
      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === id ? { ...issue, status: status as any } : issue
        )
      );
      setFilteredIssues((prev) =>
        prev.map((issue) =>
          issue._id === id ? { ...issue, status: status as any } : issue
        )
      );
    } else {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!issueToDelete) return;
    const res = await fetch(`/api/admin/issues/delete/${issueToDelete._id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Issue deleted");
      setIssues((prev) => prev.filter((i) => i._id !== issueToDelete._id));
      setFilteredIssues((prev) =>
        prev.filter((i) => i._id !== issueToDelete._id)
      );
    } else {
      toast.error("Failed to delete");
    }
    setShowDeleteConfirm(false);
    setIssueToDelete(null);
  };

  const applyFilters = () => {
    let filtered = [...issues];
    if (pinFilter.trim() !== "") {
      filtered = filtered.filter((issue) =>
        issue.pin.toLowerCase().includes(pinFilter.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }
    if (categoryFilter) {
      filtered = filtered.filter((issue) => issue.category === categoryFilter);
    }
    setFilteredIssues(filtered);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [pinFilter, statusFilter, categoryFilter]);

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-white px-6 py-8 sm:px-10">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Input
            placeholder="Filter by PIN"
            value={pinFilter}
            onChange={(e) => setPinFilter(e.target.value)}
            className="w-full"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              {[...new Set(issues.map((i) => i.category))].map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center mt-20">
            <Loader className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : filteredIssues.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-10">
            No issues to show.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">PIN</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created</th>
                  <th className="p-4">Comments</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredIssues.map((issue) => (
                  <tr key={issue._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{issue.title}</td>
                    <td className="p-4">{issue.category}</td>
                    <td className="p-4">{issue.pin}</td>
                    <td className="p-4">
                      <span className="font-semibold">{issue.user.name}</span>
                      <br />
                      <span className="text-xs text-gray-500">
                        {issue.user.email}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={`capitalize px-2 py-0.5 rounded-full text-xs font-semibold ${
                          issue.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : issue.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {issue.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:underline"
                        onClick={() => setSelectedIssue(issue)}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </td>
                    <td className="p-4 text-right space-y-2">
                      <div className="flex flex-wrap gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => updateStatus(issue._id, "in-progress")}
                        >
                          <Hammer className="w-4 h-4 mr-1" />
                          In Progress
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => updateStatus(issue._id, "resolved")}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setIssueToDelete(issue);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          <Trash className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                        {issue.lat && issue.lng && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(
                                `https://www.google.com/maps?q=${issue.lat},${issue.lng}`,
                                "_blank"
                              )
                            }
                          >
                            <MapPin className="w-4 h-4 mr-1" />
                            Map
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Likes & Comments Modal */}
        {selectedIssue && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-xl relative">
              <button
                className="absolute top-2 right-3 text-gray-600 hover:text-black"
                onClick={() => setSelectedIssue(null)}
              >
                ✖
              </button>

              <h2 className="text-lg font-semibold mb-2">
                {selectedIssue.title} - Details
              </h2>

              {/* Media */}
              {selectedIssue.media?.url ? (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-1">Media:</h3>
                  {selectedIssue.media.mimetype.startsWith("image/") ? (
                    <img
                      src={selectedIssue.media.url}
                      alt={selectedIssue.media.filename || "Issue Media"}
                      onClick={() => setZoomImage(selectedIssue.media!.url)}
                      className="w-full max-h-60 object-cover rounded border cursor-pointer hover:scale-105 transition"
                    />
                  ) : (
                    <a
                      href={selectedIssue.media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      View File ({selectedIssue.media.filename})
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400 mb-4">No media uploaded.</p>
              )}

              <div className="flex items-center mb-4 gap-2">
                <ThumbsUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {selectedIssue.upvotes} Likes
                </span>
              </div>

              <h3 className="text-sm font-semibold mb-1">Comments</h3>
              {selectedIssue.comments.length === 0 ? (
                <p className="text-sm text-gray-500">No comments available</p>
              ) : (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedIssue.comments.map((comment, idx) => (
                    <li key={idx} className="border-b pb-2">
                      <p className="text-sm">{comment.text}</p>
                      <p className="text-[11px] text-gray-500 italic">
                        —{" "}
                        {comment.user?.name ||
                          comment.user?.email ||
                          "Anonymous"}{" "}
                        • {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Zoom Image Overlay */}
        {zoomImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            onClick={() => setZoomImage(null)}
          >
            <img
              src={zoomImage}
              alt="Zoomed Media"
              className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-red-600">
                Confirm Deletion
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-700">
              Are you sure you want to delete{" "}
              <strong>{issueToDelete?.title}</strong>?
            </p>
            <DialogFooter className="mt-4 space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Yes, Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
