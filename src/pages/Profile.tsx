import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-surface-800 mb-6">Profile</h1>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700">
              Email
            </label>
            <p className="mt-1 text-surface-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700">
              Account Created
            </label>
            <p className="mt-1 text-surface-900">
              {user?.metadata.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
