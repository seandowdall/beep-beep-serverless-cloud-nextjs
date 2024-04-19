"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type User = {
  UserID: string;
  DriverLicense: string;
  Email: string;
  LicenseVerified: boolean;
  Name: string;
  PhoneNumber: string;
  ProfileCreationDate: string;
  UserApproved: boolean;
};

const ProfilePage = () => {
  const pathname = usePathname();
  const userId = pathname.split("/").pop(); // Extract the userId from the URL
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError("User ID not found.");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${apiUrl}/users/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }
        const data: User = await response.json();
        setUser(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      }
    };

    fetchUserDetails();
  }, [userId]);

  const verifyLicense = async () => {
    setLoading(true);
    setTimeout(() => {
      if (user) {
        setUser({ ...user, LicenseVerified: true });
      }
      setLoading(false);
      alert("License has been verified!");
    }, 2000);
  };

  if (error)
    return <div className="text-red-500 text-lg font-bold">Error: {error}</div>;
  if (!user) return <div className="text-lg font-bold">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile Details</h1>
      <div className="mb-4">
        <div>
          <strong>Name:</strong> {user.Name}
        </div>
        <div>
          <strong>Email:</strong> {user.Email}
        </div>
        <div>
          <strong>Phone Number:</strong> {user.PhoneNumber}
        </div>

        <div>
          <strong>License Verified:</strong>{" "}
          {user.LicenseVerified ? "Yes" : "No"}
        </div>
        <div>
          <strong>Profile Created On:</strong> {user.ProfileCreationDate}
        </div>
        <div>
          <strong>User Approved:</strong> {user.UserApproved ? "Yes" : "No"}
        </div>
      </div>
      {!user.LicenseVerified && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={verifyLicense}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify License"}
        </button>
      )}
    </div>
  );
};

export default ProfilePage;
