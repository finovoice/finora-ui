export type Renewal = "Weekly" | "Monthly" | "Quarterly"

export const getNextRenewalDate = (renewal: Renewal): string => {
  const now = new Date()
  if (renewal === "Weekly") now.setDate(now.getDate() + 7)
  else now.setMonth(now.getMonth() + (renewal === "Monthly" ? 1 : 3))
  return now.toISOString().split("T")[0]
}
