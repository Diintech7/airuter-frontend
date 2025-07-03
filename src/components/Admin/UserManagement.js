"use client"

import { useState, useEffect } from "react"
import { Search, Pencil, Trash2, Check, X, Briefcase, FileText, LogIn } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    status: "",
    applicationRange: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  })
  const [activeFilters, setActiveFilters] = useState([])
  // Changed: Track impersonation by user ID instead of global boolean
  const [impersonatingUserId, setImpersonatingUserId] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = Cookies.get("admintoken")
      if (!token) {
        toast.error("Authentication required")
        navigate("/admin/login")
        return
      }
      const response = await axios.get("https://airuter-backend.onrender.com/api/admin/users?role=jobSeeker", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.data.success) {
        throw new Error("Failed to fetch users")
      }
      const usersWithJobData = await Promise.all(
        response.data.users.map(async (user) => {
          try {
            const jobResponse = await axios.get(`https://airuter-backend.onrender.com/api/admin/users/${user._id}/applications`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              status: user.isActive ? "Active" : "Suspended",
              totalApplications: jobResponse.data.totalApplications || 0,
              activeApplications: jobResponse.data.activeApplications || 0,
              createdAt: user.createdAt,
            }
          } catch (err) {
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              status: user.isActive ? "Active" : "Suspended",
              totalApplications: 0,
              activeApplications: 0,
              createdAt: user.createdAt,
            }
          }
        }),
      )
      setUsers(usersWithJobData)
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        Cookies.remove("admintoken")
        navigate("/admin/login")
        return
      }
      toast.error(error.response?.data?.message || "Error fetching users")
    } finally {
      setLoading(false)
    }
  }

  // Fixed user impersonation function
  const handleLoginAsUser = async (userId) => {
    try {
      // Changed: Set the specific user ID being impersonated
      setImpersonatingUserId(userId)
      const adminToken = Cookies.get("admintoken")

      console.log("Attempting to impersonate user:", userId)

      const response = await axios.post(
        `https://airuter-backend.onrender.com/api/admin/users/${userId}/impersonate`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } },
      )

      if (response.data.success) {
        const { token, user, dashboardRoute } = response.data

        console.log("Impersonation successful, user data:", user)
        console.log("Dashboard route:", dashboardRoute)

        // Clear any existing tokens from all possible cookie names
        const cookieOptions = { path: "/" }
        Cookies.remove("usertoken", cookieOptions)
        Cookies.remove("user", cookieOptions)
        Cookies.remove("token", cookieOptions)
        Cookies.remove("candidatetoken", cookieOptions)
        Cookies.remove("candidate", cookieOptions)

        // Set new cookies with proper configuration
        const newCookieOptions = {
          path: "/",
          expires: 7,
          secure: false, // Set to false for localhost development
          sameSite: "lax", // Changed from strict to lax for better compatibility
        }

        // Set the token with the appropriate cookie name based on user role
        let tokenCookieName = "usertoken"
        let userCookieName = "user"

        if (user.role === "candidate") {
          tokenCookieName = "candidatetoken"
          userCookieName = "candidate"
        }

        Cookies.set(tokenCookieName, token, newCookieOptions)
        Cookies.set(userCookieName, JSON.stringify(user), newCookieOptions)

        console.log("Cookies set:")
        console.log("Token cookie:", tokenCookieName, "=", Cookies.get(tokenCookieName))
        console.log("User cookie:", userCookieName, "=", Cookies.get(userCookieName))

        // Small delay to ensure cookies are set
        setTimeout(() => {
          const targetUrl = dashboardRoute || "/dashboard"
          console.log("Opening new window to:", targetUrl)

          const newWindow = window.open(targetUrl, "_blank", "noopener,noreferrer")

          if (newWindow) {
            toast.success(`Successfully logged in as ${user.name}`)

            // Optional: Focus the new window after a short delay
            setTimeout(() => {
              newWindow.focus()
            }, 500)
          } else {
            toast.error("Popup blocked. Please allow popups for this site.")
          }
        }, 100)
      }
    } catch (error) {
      console.error("Error during user impersonation:", error)
      toast.error(error.response?.data?.message || "Failed to login as user")
    } finally {
      // Changed: Clear the specific user ID being impersonated
      setImpersonatingUserId(null)
    }
  }

  const applyFiltersAndSearch = (userList) => {
    let filteredUsers = [...userList]
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (filters.status) {
      filteredUsers = filteredUsers.filter((user) => {
        if (filters.status === "active") return user.status === "Active"
        if (filters.status === "suspended") return user.status === "Suspended"
        return true
      })
    }
    if (filters.applicationRange) {
      filteredUsers = filteredUsers.filter((user) => {
        switch (filters.applicationRange) {
          case "none":
            return user.totalApplications === 0
          case "low":
            return user.totalApplications > 0 && user.totalApplications <= 5
          case "medium":
            return user.totalApplications > 5 && user.totalApplications <= 15
          case "high":
            return user.totalApplications > 15
          default:
            return true
        }
      })
    }
    filteredUsers.sort((a, b) => {
      let compareValue = 0
      switch (filters.sortBy) {
        case "name":
          compareValue = a.name.localeCompare(b.name)
          break
        case "applications":
          compareValue = a.totalApplications - b.totalApplications
          break
        case "createdAt":
        default:
          compareValue = new Date(a.createdAt) - new Date(b.createdAt)
          break
      }
      return filters.sortOrder === "asc" ? compareValue : -compareValue
    })
    return filteredUsers
  }

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const isActive = currentStatus === "Active" ? false : true
      const token = Cookies.get("admintoken")
      const response = await axios.patch(
        `https://airuter-backend.onrender.com/api/admin/users/${userId}/status`,
        { isActive },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (response.data.success) {
        setUsers(
          users.map((user) => (user.id === userId ? { ...user, status: isActive ? "Active" : "Suspended" } : user)),
        )
        toast.success(`User ${isActive ? "activated" : "suspended"} successfully`)
      }
    } catch (error) {
      console.error("Error updating user status:", error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        Cookies.remove("admintoken")
        navigate("/admin/login")
        return
      }
      toast.error(error.response?.data?.message || "Error updating user status")
    }
  }

  const viewUserResume = async (userId) => {
    try {
      const token = Cookies.get("admintoken")

      const response = await axios.get(`https://airuter-backend.onrender.com/api/admin/users/${userId}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.data.success) {
        throw new Error(response.data.message || "Resume not found")
      }
      const profile = response.data.profile
      if (profile && profile.resumePath) {
        if (profile.resumePath.startsWith("/uploads/")) {
          window.open(`https://airuter-backend.onrender.com${profile.resumePath}`, "_blank")
        } else if (profile.resumePath.startsWith("http")) {
          window.open(profile.resumePath, "_blank")
        } else {
          toast.info("Resume content available but not in previewable format")
        }
      } else {
        throw new Error("Resume path not found")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching resume")
    }
  }

  const handleEditUser = (user) => {
    setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
    setShowEditUserModal(true)
  }

  const handleDeleteUser = (user) => {
    setCurrentUser({
      id: user.id,
      name: user.name,
    })
    setShowDeleteConfirmModal(true)
  }

  const filteredUsers = applyFiltersAndSearch(users)

  return (
    <div className="max-w-full px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden w-full">
        {loading ? (
          <div className="p-6 text-center">Loading Users...</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "recruiter"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                              : user.role === "partner"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                          }`}
                        >
                          {user.role === "jobSeeker"
                            ? "Job Seeker"
                            : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                          <span>
                            {user.totalApplications} total ({user.activeApplications} active)
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-green-600"
                            onClick={() => viewUserResume(user.id)}
                            title="View Resume"
                          >
                            <FileText className="h-4 w-4" />
                          </button>

                          {/* Login as User Button - Changed: Check if this specific user is being impersonated */}
                          <button
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-blue-600"
                            onClick={() => handleLoginAsUser(user.id)}
                            title="Login as User"
                            disabled={impersonatingUserId === user.id}
                          >
                            {impersonatingUserId === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            ) : (
                              <LogIn className="h-4 w-4" />
                            )}
                          </button>

                          {user.status === "Active" ? (
                            <button
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              onClick={() => handleToggleUserStatus(user.id, user.status)}
                              title="Suspend User"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </button>
                          ) : (
                            <button
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              onClick={() => handleToggleUserStatus(user.id, user.status)}
                              title="Activate User"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </button>
                          )}
                          <button
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            onClick={() => handleEditUser(user)}
                            title="Edit User"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            onClick={() => handleDeleteUser(user)}
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No Users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditUserModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Edit User</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                // Handle form submission
                setShowEditUserModal(false)
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select
                  value={currentUser.role}
                  onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="user">User</option>
                  <option value="jobSeeker">Job Seeker</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="partner">Partner</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Delete User</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete user "{currentUser.name}"? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle delete
                  setShowDeleteConfirmModal(false)
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement