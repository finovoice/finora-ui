"use client"

import Sidebar from "@/components/sidebar"
import { useState } from "react"
import { Edit, Plus, Trash2 } from "lucide-react"
import PlanDialog, { type PlanDetails } from "@/components/plan-dialog"
import EmployeeDialog, { type Employee } from "@/components/employee-dialog"
import ConfirmDialog from "@/components/confirm-dialog"
import OrganisationDetails from "@/components/organisation-details";
import { UserProfileAbout } from "@/components/settings/UserProfileAbout";
import { UserProfilePasswordManagement } from "@/components/settings/UserProfilePasswordManagement";

type SettingsTab = "Organization" | "User profile";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Organization");

  const [plans, setPlans] = useState<PlanDetails[]>([
    { id: "1", name: "Elite", prices: { QUARTERLY: 5000 } },
  ]);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanDetails | null>(null);
  const [confirmPlanId, setConfirmPlanId] = useState<string | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([
    { id: "e1", firstName: "Olivia", lastName: "Rhye", email: "name@email.com", role: "Relationship Manager", status: { label: "Invited", color: "#6941c6", bg: "#f9f5ff", border: "#e9d7fe" }, lastLogin: "N/A" },
    { id: "e2", firstName: "Phoenix", lastName: "Baker", email: "name@email.com", role: "Relationship Manager", status: { label: "Active", color: "#027a48", bg: "#ecfdf3", border: "#abefc6" }, lastLogin: "24th Apr 2025" },
    { id: "e3", firstName: "Candice", lastName: "Wu", email: "name@email.com", role: "Research Analyst", status: { label: "Active", color: "#027a48", bg: "#ecfdf3", border: "#abefc6" }, lastLogin: "24th Apr 2025" },
  ]);
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [confirmEmployeeId, setConfirmEmployeeId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#101828]">
      <div className="mx-auto flex">
        <Sidebar />
        <main className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-[#fafafa] border-b border-[#e4e7ec]">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-[#101828]">Settings</h1>
                <div className="flex items-center gap-2 text-sm text-[#667085]">
                  <button
                    onClick={() => setActiveTab("Organization")}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${activeTab === "Organization" ? "bg-[#f9f5ff] text-[#6941c6] border border-[#e9d7fe]" : "bg-[#f2f4f7] text-[#344054] border border-[#e4e7ec]"} hover:bg-[#f2f4f7]`}
                  >
                    Organization
                  </button>
                  <button
                    onClick={() => setActiveTab("User profile")}
                    className={`text-sm ${activeTab === "User profile" ? "text-[#6941c6] font-medium bg-[#f9f5ff] rounded-md px-2 py-1" : "text-[#667085]"} hover:text-[#475467]`}
                  >
                    User profile
                  </button>
                </div>
              </div>
            </div>
          </header>

          {activeTab === "Organization" ? (
            <>
              {/* About Card */}
              <section className="px-6 py-6">
                <OrganisationDetails />
              </section>

              {/* Employees */}
              <section className="px-6 pb-6">
                <div className="rounded-lg border border-[#e4e7ec] bg-white overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#e4e7ec] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-medium text-[#344054]">Employees</h2>
                      <button onClick={() => { setEditingEmployee(null); setEmployeeDialogOpen(true) }} className="inline-flex items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-2 py-1 text-xs text-[#344054] hover:bg-[#f2f4f7]">
                        <Plus className="h-3 w-3" /> Add
                      </button>
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
                        onEdit={() => { setEditingEmployee(e); setEmployeeDialogOpen(true) }}
                        onDelete={() => setConfirmEmployeeId(e.id!)}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Subscription plans */}
              <section className="px-6 pb-10">
                <div className="rounded-lg border border-[#e4e7ec] bg-white overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#e4e7ec] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-medium text-[#344054]">Subscription plans</h2>
                      <button onClick={() => { setEditingPlan(null); setPlanDialogOpen(true) }} className="inline-flex items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-2 py-1 text-xs text-[#344054] hover:bg-[#f2f4f7]">
                        <Plus className="h-3 w-3" /> Add
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_200px_220px_200px_80px_80px] items-center gap-4 px-6 py-4 text-sm text-[#667085]">
                    <div className="text-[#98a2b3]">Name</div>
                    <div className="text-[#98a2b3]">Allowed renewal periods</div>
                    <div className="text-[#98a2b3]">Recommended price</div>
                    <div />
                    <div />
                    <div />
                  </div>
                  {plans.map((plan) => {
                    const allowed = Object.keys(plan.prices).map((k) =>
                      k === 'WEEKLY' ? 'Weekly' : k === 'MONTHLY' ? 'Monthly' : 'Quarterly'
                    ).join(', ')
                    // choose a recommended price: prefer QUARTERLY else MONTHLY else WEEKLY
                    const recommended = plan.prices.QUARTERLY ?? plan.prices.MONTHLY ?? plan.prices.WEEKLY
                    return (
                      <div key={plan.id} className="grid grid-cols-[1fr_200px_220px_200px_80px_80px] items-center gap-4 px-6 py-3 border-t border-[#e4e7ec] text-sm">
                        <div>{plan.name}</div>
                        <div>{allowed || '-'}</div>
                        <div>{recommended != null ? `₹${recommended}` : '-'}</div>
                        <div />
                        <div className="justify-self-end">
                          <button onClick={() => { setEditingPlan(plan); setPlanDialogOpen(true) }} className="rounded-md p-1.5 hover:bg-[#f2f4f7]" aria-label="edit plan">
                            <Edit className="h-4 w-4 text-[#667085]" />
                          </button>
                        </div>
                        <div className="justify-self-end">
                          <button onClick={() => setConfirmPlanId(plan.id!)} className="rounded-md p-1.5 hover:bg-[#f2f4f7]" aria-label="delete plan">
                            <Trash2 className="h-4 w-4 text-[#667085]" />
                          </button>
                        </div>
                      </div>
                    )
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
            onOpenChange={(v) => { if (!v) setEditingEmployee(null); setEmployeeDialogOpen(v) }}
            initial={editingEmployee}
            onSave={(data) => {
              setEmployees((prev) => {
                if (data.id) {
                  return prev.map((e) => (e.id === data.id ? { ...e, ...data } : e))
                }
                const newEmp = { ...data, id: String(Date.now()), status: { label: "Invited", color: "#6941c6", bg: "#f9f5ff", border: "#e9d7fe" }, lastLogin: "N/A" }
                return [newEmp, ...prev]
              })
              setEmployeeDialogOpen(false)
              setEditingEmployee(null)
            }}
          />

          {/* Add/Edit Plan Dialog */}
          <PlanDialog
            open={planDialogOpen}
            onOpenChange={(v) => { if (!v) setEditingPlan(null); setPlanDialogOpen(v) }}
            initial={editingPlan}
            onSave={(data) => {
              // update or add
              setPlans((prev) => {
                if (data.id) {
                  return prev.map((p) => (p.id === data.id ? { ...p, ...data } : p))
                }
                const newPlan = { ...data, id: String(Date.now()) }
                return [...prev, newPlan]
              })
              setPlanDialogOpen(false)
              setEditingPlan(null)
            }}
          />

          {/* Confirm delete - Employee */}
          <ConfirmDialog
            open={!!confirmEmployeeId}
            onOpenChange={(v) => { if (!v) setConfirmEmployeeId(null) }}
            title="Delete team member?"
            description="This action will remove the employee from the list."
            confirmText="Delete"
            onConfirm={() => {
              if (confirmEmployeeId) {
                setEmployees((prev) => prev.filter((e) => e.id !== confirmEmployeeId))
                setConfirmEmployeeId(null)
              }
            }}
            danger
          />

          {/* Confirm delete - Plan */}
          <ConfirmDialog
            open={!!confirmPlanId}
            onOpenChange={(v) => { if (!v) setConfirmPlanId(null) }}
            title="Delete plan?"
            description="This plan will be removed and will not be available to assign."
            confirmText="Delete"
            onConfirm={() => {
              if (confirmPlanId) {
                setPlans((prev) => prev.filter((p) => p.id !== confirmPlanId))
                setConfirmPlanId(null)
              }
            }}
            danger
          />
        </main>
      </div>
    </div>
  )
}

function EmployeesRow({
  name,
  email,
  status,
  role,
  lastLogin,
  onEdit,
  onDelete,
}: {
  name: string
  email: string
  status: { label: string; color: string; bg: string; border: string }
  role: string
  lastLogin: string
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="grid grid-cols-[1fr_120px_220px_1fr_40px_40px] items-center gap-4 px-6 py-3 border-t border-[#e4e7ec]">
      <button onClick={onEdit} className="flex flex-col text-left focus:outline-none">
        <div className="text-sm text-[#101828]">{name}</div>
        <div className="text-xs text-[#667085]">{email}</div>
      </button>
      <div>
        <span
          className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border"
          style={{ color: status.color, background: status.bg, borderColor: status.border }}
        >
          {status.label}
        </span>
      </div>
      <div className="text-sm text-[#101828]">{role}</div>
      <div className="text-sm text-[#101828]">{lastLogin}</div>
      <div className="justify-self-end">
        <button onClick={onEdit} className="rounded-md p-1.5 hover:bg-[#f2f4f7]" aria-label="edit employee">
          <Edit className="h-4 w-4 text-[#667085]" />
        </button>
      </div>
      <div className="justify-self-end">
        <button onClick={onDelete} className="rounded-md p-1.5 hover:bg-[#f2f4f7]" aria-label="delete employee">
          <Trash2 className="h-4 w-4 text-[#667085]" />
        </button>
      </div>
    </div>
  )
}
