import { SubscriptionType } from "../constants/types";

export function getCurrentSubscriptionFromList(
    subscriptions: SubscriptionType[]
): SubscriptionType | null {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to start of day for comparison

    for (const subscription of subscriptions) {
        if (subscription.start_date && subscription.end_date) {
            const startDate = new Date(subscription.start_date);
            const endDate = new Date(subscription.end_date);

            // Normalize start and end dates to start of day for comparison
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            if (now >= startDate && now <= endDate) {
                return subscription;
            }
        }
    }
    return null;
}
