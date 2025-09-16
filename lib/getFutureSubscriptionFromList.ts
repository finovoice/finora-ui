import { SubscriptionType } from "../constants/types";
import { getCurrentSubscriptionFromList } from "./getCurrentSubscriptionFromList";

export function getFutureSubscriptionsFromList(
    subscriptions: SubscriptionType[]
): SubscriptionType[] | null {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to start of day for comparison

    const currentSubscription = getCurrentSubscriptionFromList(subscriptions);

    let futureSubscriptions: SubscriptionType[] | null = null;

    if (currentSubscription) {
        // If there's an ongoing subscription, future subscriptions start after its end date
        const currentSubscriptionEndDate = new Date(currentSubscription.end_date);
        currentSubscriptionEndDate.setHours(0, 0, 0, 0);

        futureSubscriptions = subscriptions.filter((subscription) => {
            if (subscription.start_date) {
                const startDate = new Date(subscription.start_date);
                startDate.setHours(0, 0, 0, 0);
                return startDate > currentSubscriptionEndDate;
            }
            return false;
        });
    } else {
        // If no ongoing subscription, future subscriptions start after the current date
        futureSubscriptions = subscriptions.filter((subscription) => {
            if (subscription.start_date) {
                const startDate = new Date(subscription.start_date);
                startDate.setHours(0, 0, 0, 0);
                return startDate > now;
            }
            return false;
        });
    }

    // Sort future subscriptions by start_date in ascending order
    futureSubscriptions.sort((a, b) => {
        if (!a.start_date || !b.start_date) return 0; // Should not happen if filtered correctly
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    });
    return futureSubscriptions.length == 0 ? null : futureSubscriptions;
}
