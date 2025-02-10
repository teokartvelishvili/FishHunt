"use client";

import { Pencil, Trash2, ShieldCheck, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { deleteUser } from "@/modules/admin/actions/delete-user";
import type { User } from "@/types";
import "./usersList.css";

interface UsersListProps {
  users: User[];
}

export function UsersList({ users }: UsersListProps) {
  const router = useRouter();

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const result = await deleteUser(userId);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    }
  };

  return (
    <div className="usr-card">
      <div className="usr-header">
        <h1 className="usr-title">Users</h1>
      </div>
      <table className="usr-table">
        <thead>
          <tr className="usr-thead-row">
            <th className="usr-th">ID</th>
            <th className="usr-th">NAME</th>
            <th className="usr-th">EMAIL</th>
            <th className="usr-th">ROLE</th>
            <th className="usr-th">JOINED</th>
            <th className="usr-th usr-th-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className="usr-tr" key={user._id}>
              <td className="usr-td usr-td-bold">#{user._id}</td>
              <td className="usr-td">{user.name}</td>
              <td className="usr-td">{user.email}</td>
              <td className="usr-td">
                {user.isAdmin ? (
                  <span className="usr-badge-admin">
                    <ShieldCheck className="usr-icon" />
                    Admin
                  </span>
                ) : (
                  <span className="usr-badge">
                    <UserIcon className="usr-icon" />
                    Customer
                  </span>
                )}
              </td>
              <td className="usr-td">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="usr-td usr-td-right">
                <div className="usr-actions">
                  <button
                    className="usr-btn"
                    onClick={() => router.push(`/admin/users/${user._id}/edit`)}
                  >
                    <Pencil className="usr-icon" />
                  </button>
                  <button
                    className="usr-btn usr-btn-danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    <Trash2 className="usr-icon" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
