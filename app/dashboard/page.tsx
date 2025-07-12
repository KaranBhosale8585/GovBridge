"use client";

import { useEffect, useState } from "react";
import { Loader, Trash, CheckCircle, Hammer } from "lucide-react";
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
import AdminHeader from "@/components/AdminHeader";

type Issue = {
  _id: string;
  title: string;
  description: string;
  category: string;
  pin: string;
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
};

export default function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinFilter, setPinFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

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
      fetchIssues();
    } else {
      toast.error("Failed to update");
    }
  };

  const deleteIssue = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this issue?");
    if (!confirmed) return;

    const res = await fetch(`/api/admin/issues/delete/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Issue deleted");
      fetchIssues();
    } else {
      toast.error("Failed to delete");
    }
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
      <div className="min-h-screen bg-gray-50 px-8 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Input
            placeholder="Filter by PIN"
            value={pinFilter}
            onChange={(e) => setPinFilter(e.target.value)}
            className="w-full sm:w-48"
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
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
            <Loader className="h-6 w-6 animate-spin text-gray-600" />
          </div>
        ) : filteredIssues.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-10">
            No issues to show.
          </p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-sm text-sm">
              <thead className="bg-gray-100 text-left text-gray-700 font-semibold">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">PIN</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr
                    key={issue._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{issue.title}</td>
                    <td className="p-3">{issue.category}</td>
                    <td className="p-3">{issue.pin}</td>
                    <td className="p-3">
                      {issue.user.name}
                      <br />
                      <span className="text-xs text-gray-500">
                        {issue.user.email}
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge
                        className={`capitalize ${
                          issue.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : issue.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {issue.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => updateStatus(issue._id, "in-progress")}
                      >
                        <Hammer className="w-4 h-4 mr-1" />
                        In Progress
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => updateStatus(issue._id, "resolved")}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteIssue(issue._id)}
                      >
                        <Trash className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
