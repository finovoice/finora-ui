"use client"

import Sidebar from "@/components/sidebar"
import { useState } from "react"
import { Edit, Link as LinkIcon, Mail, Pencil, Phone, Plus, Trash2 } from "lucide-react"
import OrgEditDialog, { type OrgDetails } from "@/components/org-edit-dialog"
import PlanDialog, { type PlanDetails } from "@/components/plan-dialog"
import EmployeeDialog, { type Employee } from "@/components/employee-dialog"
import ConfirmDialog from "@/components/confirm-dialog"

export default function SettingsPage() {
  const [plans, setPlans] = useState<PlanDetails[]>([
    { id: "1", name: "Elite", prices: { QUARTERLY: 5000 } },
  ])
  const [planDialogOpen, setPlanDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PlanDetails | null>(null)
  const [confirmPlanId, setConfirmPlanId] = useState<string | null>(null)

  const [employees, setEmployees] = useState<Employee[]>([
    { id: "e1", firstName: "Olivia", lastName: "Rhye", email: "name@email.com", role: "Relationship Manager", status: {label: "Invited", color: "#6941c6", bg: "#f9f5ff", border: "#e9d7fe"}, lastLogin: "N/A" },
    { id: "e2", firstName: "Phoenix", lastName: "Baker", email: "name@email.com", role: "Relationship Manager", status: {label: "Active", color: "#027a48", bg: "#ecfdf3", border: "#abefc6"}, lastLogin: "24th Apr 2025" },
    { id: "e3", firstName: "Candice", lastName: "Wu", email: "name@email.com", role: "Research Analyst", status: {label: "Active", color: "#027a48", bg: "#ecfdf3", border: "#abefc6"}, lastLogin: "24th Apr 2025" },
  ])
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [confirmEmployeeId, setConfirmEmployeeId] = useState<string | null>(null)

  const [orgOpen, setOrgOpen] = useState(false)
  const initialOrg: OrgDetails = {
    name: "XZY company pvt ltd",
    license: "abcd123456f",
    address: "X street, Y building, Z City, State, Country - pincode",
    email: "xyz@company.com",
    website: "companyname.com",
    phone: "+91-9876543210",
    gstin: "",
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
                <h1 className="text-lg font-semibold text-[#101828]">Settings</h1>
                <div className="flex items-center gap-2 text-sm text-[#667085]">
                  <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium bg-[#f2f4f7] text-[#344054] border border-[#e4e7ec]">
                    Organization
                  </span>
                  <button className="text-sm text-[#667085] hover:text-[#475467]">User profile</button>
                </div>
              </div>
            </div>
          </header>

          {/* About Card */}
          <section className="px-6 py-6">
            <div className="rounded-lg border border-[#e4e7ec] bg-white">
              <div className="flex items-center justify-between border-b border-[#e4e7ec] px-4 py-3">
                <h2 className="text-sm font-medium text-[#344054]">About</h2>
                <button onClick={() => setOrgOpen(true)} className="inline-flex items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-3 py-1.5 text-sm text-[#344054] hover:bg-[#f2f4f7]">
                  <Pencil className="h-4 w-4" /> Edit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 px-6 py-6">
                {/* Logo */}
                <div className="space-y-2">
                  <div className="text-xs text-[#667085]">Logo</div>
                  <div className="h-12 w-12 rounded-md bg-[#f2f4f7] flex items-center justify-center">
                    {/* placeholder logo */}
                    <span className="text-[#667085] text-lg font-semibold">F</span>
                  </div>
                </div>

                {/* Org name */}
                <div className="space-y-2">
                  <div className="text-xs text-[#667085]">Org name</div>
                  <div className="text-sm">XZY company pvt ltd</div>
                </div>

                {/* License */}
                <div className="space-y-2">
                  <div className="text-xs text-[#667085]">SEBI Registered License Number</div>
                  <div className="text-sm">abcd123456f</div>
                </div>

                {/* Registered address */}
                <div className="space-y-2">
                  <div className="text-xs text-[#667085]">Registered address</div>
                  <div className="text-sm">X street, Y building, Z City, State, Country - pincode</div>
                </div>

                {/* Registered Email */}
                <div className="space-y-2">
                  <div className="text-xs text-[#667085]">Registered Email</div>
                  <div className="inline-flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-[#98a2b3]" /> xyz@company.com
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <div className="text-xs text-[#667085]">Website</div>
                  <div className="inline-flex items-center gap-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-[#98a2b3]" /> companyname.com
                  </div>
                </div>

                {/* Registered phone */}
                <div className="space-y-2">
                  <div className="text-xs text-[#667085]">Registered phone</div>
                  <div className="inline-flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-[#98a2b3]" /> +91-9876543210
                  </div>
                </div>

                {/* Sign */}
                <div className="space-y-2">
                  <div className="text-xs text-[#667085]">Sign</div>
                  <div className="h-10 w-24 bg-[url('/signature.png')] bg-[length:96px_40px] bg-no-repeat" aria-label="signature" />
                </div>

                {/* GST Number */}
                <div className="space-y-2">
                  <div className="text-xs text-[#667085]">GST Number</div>
                  <div className="text-sm">-</div>
                </div>
              </div>
            </div>
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
        {/* Edit Organisation Dialog */}
          <OrgEditDialog open={orgOpen} onOpenChange={setOrgOpen} initial={initialOrg} onSave={() => setOrgOpen(false)} />

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
                const newEmp = { ...data, id: String(Date.now()), status: {label: "Invited", color: "#6941c6", bg: "#f9f5ff", border: "#e9d7fe"}, lastLogin: "N/A" }
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
