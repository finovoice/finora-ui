"use client";

import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import PlanDialog from "@/components/plan-dialog";
import EmployeeDialog, { type Employee } from "@/components/employee-dialog";
import ConfirmDialog from "@/components/confirm-dialog";
import OrganisationDetails from "@/components/organisation-details";
import { UserProfileAbout } from "@/components/settings/UserProfileAbout";
import { UserProfilePasswordManagement } from "@/components/settings/UserProfilePasswordManagement";
import {
  getPlansAPI,
  type PlanDetails,
  createPlanAPI,
  updatePlanAPI,
  deletePlanAPI,
  PlanType,
} from "@/services/plan";
import { useAtom } from "jotai";
import { userAtom } from "@/hooks/user-atom";
import { showToast } from "@/components/ui/toast-manager";
import { getAllUsers } from "@/services/clients";

type SettingsTab = "Organization" | "User profile";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Organization");

  const [plans, setPlans] = useState<PlanType[]>([]);

  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanDetails | null>(null);
  const [confirmPlanId, setConfirmPlanId] = useState<number | null>(null);
  const typeLabels: Record<string, string> = {
    STANDARD: "Standard",
    PREMIUM: "Premium",
    ELITE: "Elite",
  };
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();

        const mappedEmployees: Employee[] = users.map((user) => {
          const [firstName, lastName = ""] = user.email
            .split("@")[0]
            .split(".");
          return {
            id: user.id.toString(),
            firstName:
              firstName?.charAt(0).toUpperCase() + firstName?.slice(1) ||
              "Unknown",
            lastName:
              lastName?.charAt(0).toUpperCase() + lastName?.slice(1) || "",
            email: user.email,
            role:
              user.type === "RM"
                ? "Relationship Manager"
                : user.type === "RA"
                ? "Research Analyst"
                : "Admin",
            status: {
              label: user.is_admin || user.is_org_admin ? "Active" : "Invited",
              color: user.is_admin || user.is_org_admin ? "#027a48" : "#6941c6",
              bg: user.is_admin || user.is_org_admin ? "#ecfdf3" : "#f9f5ff",
              border:
                user.is_admin || user.is_org_admin ? "#abefc6" : "#e9d7fe",
            },
            lastLogin: "N/A", // You can update this once backend provides it
          };
        });

        setEmployees(mappedEmployees);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [confirmEmployeeId, setConfirmEmployeeId] = useState<string | null>(
    null
  );
  const [user] = useAtom(userAtom);

  useEffect(() => {
    getPlansAPI()
      .then((data) => {
        const formatted = data.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          renewal_period: p.renewal_period,
          organisation: p.organisation,
          type: p.type,
          is_active: p.is_active,
        }));
        setPlans(formatted);
      })
      .catch((err) => {
        console.error("Error fetching plans:", err);
      });
  }, []);

  // Handler to delete a plan
  async function handleDeletePlan(id: number) {
    try {
      await deletePlanAPI(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      setConfirmPlanId(null);
    } catch (error) {
      alert("Failed to delete plan.");
      console.error(error);
    }
  }

  // Handler to delete an employee
  function handleDeleteEmployee(id: string) {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setConfirmEmployeeId(null);
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#101828]">
      <div className="mx-auto flex">
        <Sidebar />
        <main className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-[#fafafa] border-b border-[#e4e7ec]">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-[#101828]">
                  Settings
                </h1>
                <div className="flex items-center gap-2 text-sm text-[#667085]">
                  <button
                    onClick={() => setActiveTab("Organization")}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
                      activeTab === "Organization"
                        ? "bg-[#f9f5ff] text-[#6941c6] border border-[#e9d7fe]"
                        : "bg-[#f2f4f7] text-[#344054] border border-[#e4e7ec]"
                    } hover:bg-[#f2f4f7]`}
                  >
                    Organization
                  </button>
                  <button
                    onClick={() => setActiveTab("User profile")}
                    className={`text-sm ${
                      activeTab === "User profile"
                        ? "text-[#6941c6] font-medium bg-[#f9f5ff] rounded-md px-2 py-1"
                        : "text-[#667085]"
                    } hover:text-[#475467]`}
                  >
                    User profile
                  </button>
                </div>
              </div>
            </div>
          </header>

          {activeTab === "Organization" ? (
            <>
              {/* Organisation Details */}
              <section className="px-6 py-6">
                <OrganisationDetails />
              </section>

              {/* Employees */}
              <section className="px-6 pb-6">
                <div className="rounded-lg border border-[#e4e7ec] bg-white overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#e4e7ec] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-medium text-[#344054]">
                        Employees
                      </h2>
                    </div>
                  </div>
                  <div>
                    {employees.map((e) => (
                      <EmployeesRow
                        key={e.id}
                        name={`${e.firstName} ${e.lastName}`}
                        email={e.email}
                        status={e.status!}
                        role={e.role}
                        lastLogin={e.lastLogin || "N/A"}
                        onEdit={() => {
                          setEditingEmployee(e);
                          setEmployeeDialogOpen(true);
                        }}
                        onDelete={() => setConfirmEmployeeId(e.id!)}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Subscription Plans */}
              <section className="px-6 pb-10">
                <div className="rounded-lg border border-[#e4e7ec] bg-white overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#e4e7ec] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-medium text-[#344054]">
                        Subscription plans
                      </h2>
                      <button
                        onClick={() => {
                          setEditingPlan(null);
                          setPlanDialogOpen(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-2 py-1 text-xs text-[#344054] hover:bg-[#f2f4f7]"
                      >
                        <Plus className="h-3 w-3" /> Add
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-[0.9fr_160px_200px_160px_80px_80px] items-center gap-4 px-6 py-4 text-sm text-[#667085]">
                    <div className="text-[#98a2b3]">Name</div>
                    <div className="text-[#98a2b3]">Type</div>
                    <div className="text-[#98a2b3]">
                      Allowed renewal periods
                    </div>
                    <div className="text-[#98a2b3]">Recommended price</div>
                    <div />
                    <div />
                  </div>

                  {plans.map((plan) => {
                    const allowed = plan.renewal_period;
                    const recommended = plan.price;
                    return (
                      <div
                        key={plan.id}
                        className="grid grid-cols-[0.9fr_160px_200px_160px_80px_80px] items-center gap-4 px-6 py-3 border-t border-[#e4e7ec] text-sm"
                      >
                        <div>{plan.name}</div>
                        <div>{typeLabels[plan.type] || plan.type}</div>
                        <div>{plan.renewal_period || "-"}</div>
                        <div>{plan.price != null ? `₹${plan.price}` : "-"}</div>
                        <div className="justify-self-end">
                          <button
                            onClick={() => {
                              setEditingPlan(plan);
                              setPlanDialogOpen(true);
                            }}
                            className="rounded-md p-1.5 hover:bg-[#f2f4f7]"
                            aria-label="edit plan"
                          >
                            <Edit className="h-4 w-4 text-[#667085]" />
                          </button>
                        </div>
                        <div className="justify-self-end">
                          <button
                            onClick={() => setConfirmPlanId(plan.id!)}
                            className="rounded-md p-1.5 hover:bg-[#f2f4f7]"
                            aria-label="delete plan"
                          >
                            <Trash2 className="h-4 w-4 text-[#667085]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          ) : (
            <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <UserProfileAbout />
              <UserProfilePasswordManagement />
            </div>
          )}

          {/* Add/Edit Employee Dialog */}
          <EmployeeDialog
            open={employeeDialogOpen}
            onOpenChange={(v) => {
              if (!v) setEditingEmployee(null);
              setEmployeeDialogOpen(v);
            }}
            initial={editingEmployee}
            onSave={(data) => {
              setEmployees((prev) => {
                if (data.id) {
                  return prev.map((e) =>
                    e.id === data.id ? { ...e, ...data } : e
                  );
                }
                const newEmp = {
                  ...data,
                  id: String(Date.now()),
                  status: {
                    label: "Invited",
                    color: "#6941c6",
                    bg: "#f9f5ff",
                    border: "#e9d7fe",
                  },
                  lastLogin: "N/A",
                };
                return [newEmp, ...prev];
              });
              setEmployeeDialogOpen(false);
              setEditingEmployee(null);
            }}
          />

          {/* Add/Edit Plan Dialog */}
          <PlanDialog
            open={planDialogOpen}
            onOpenChange={(v) => {
              if (!v) setEditingPlan(null);
              setPlanDialogOpen(v);
            }}
            initial={editingPlan}
            onSave={async (data) => {
              try {
                if (data.id) {
                  // Update existing plan
                  await updatePlanAPI({
                    id: data.id,
                    name: data.name,
                    price: data.price,
                    is_active: true,
                  });

                  setPlans((prev) =>
                    prev.map((p) => (p.id === data.id ? { ...p, ...data } : p))
                  );

                  showToast({
                    title: "Plan Updated",
                    description: "The plan was updated successfully.",
                    type: "success",
                    duration: 3000,
                  });
                } else {
                  // Prevent duplicate renewal_period plans for same org/type
                  const existingPlan = plans.find(
                    (p) =>
                      p.organisation === user?.organisation &&
                      p.type === data.type && // safer than string splitting
                      p.renewal_period === data.renewal_period
                  );

                  if (existingPlan) {
                    showToast({
                      title: "Duplicate Plan",
                      description:
                        "A plan with this type and renewal period already exists.",
                      type: "warning",
                      duration: 3000,
                    });
                    return;
                  }
                  const existingName = plans.find(
                    (p) => p.name === data.name // also check name to avoid duplicates
                  );
                  if (existingName) {
                    showToast({
                      title: "Duplicate Plan Name",
                      description: "A plan with this Name already exists.",
                      type: "warning",
                      duration: 3000,
                    });
                    return;
                  }

                  // Create new plan
                  const created = await createPlanAPI({
                    name: data.name,
                    price: data.price,
                    renewal_period: data.renewal_period!,
                    is_active: true,
                    organisation: user?.organisation as number,
                    type: data.type!,
                  });

                  setPlans((prev) => [...prev, created]);

                  showToast({
                    title: "Plan Created",
                    description: "A new plan was created successfully.",
                    type: "success",
                    duration: 3000,
                  });
                }

                setPlanDialogOpen(false);
                setEditingPlan(null);
              } catch (error: any) {
                const message =
                  error?.response?.data?.errors?.non_field_errors?.[0] ||
                  error?.response?.data?.errors?.name?.[0] ||
                  error?.response?.data?.detail ||
                  "An unexpected error occurred.";

                showToast({
                  title: "Error",
                  description: message,
                  type: "error",
                  duration: 3000,
                });

                console.error(error);
              }
            }}
          />

          {/* Confirm Delete Plan Dialog */}
          <ConfirmDialog
            open={!!confirmPlanId}
            onOpenChange={(v) => !v && setConfirmPlanId(null)}
            title="Delete Plan"
            description="Are you sure you want to delete this plan? This action cannot be undone."
            onConfirm={() => confirmPlanId && handleDeletePlan(confirmPlanId)}
          />

          {/* Confirm Delete Employee Dialog */}
          <ConfirmDialog
            open={!!confirmEmployeeId}
            onOpenChange={(v) => !v && setConfirmEmployeeId(null)}
            title="Delete Employee"
            description="Are you sure you want to remove this employee? This action cannot be undone."
            onConfirm={() =>
              confirmEmployeeId && handleDeleteEmployee(confirmEmployeeId)
            }
          />
        </main>
      </div>
    </div>
  );
}

// Simple employee row component for list display
function EmployeesRow({
  name,
  email,
  status,
  role,
  lastLogin,
  onEdit,
  onDelete,
}: {
  name: string;
  email: string;
  status: {
    label: string;
    color: string;
    bg: string;
    border: string;
  };
  role: string;
  lastLogin: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] items-center border-t border-[#e4e7ec] px-4 py-3 text-sm gap-4">
      <div>
        <div className="font-semibold text-[#101828]">{name}</div>
        <div className="text-[#667085]">{email}</div>
      </div>
      <div
        className="rounded-full px-2 py-0.5 text-xs font-semibold justify-self-start"
        style={{
          backgroundColor: status.bg,
          border: `1px solid ${status.border}`,
          color: status.color,
          minWidth: 70,
          textAlign: "center",
        }}
      >
        {status.label}
      </div>
      <div className="text-[#344054]">{role}</div>
      <div className="text-[#667085]">{lastLogin}</div>
    </div>
  );
}
