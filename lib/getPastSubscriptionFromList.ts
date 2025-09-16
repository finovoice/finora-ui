import { SubscriptionType } from "../constants/types";
import { getCurrentSubscriptionFromList } from "./getCurrentSubscriptionFromList";

export function getPastSubscriptionFromList(
    subscriptions: SubscriptionType[]
): SubscriptionType[] | null {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to start of day for comparison

    const currentSubscription = getCurrentSubscriptionFromList(subscriptions);

    let pastSubscriptions: SubscriptionType[] = [];

    if (currentSubscription) {
        // If there's an ongoing subscription, past subscriptions end before its start date
        const currentSubscriptionStartDate = new Date(currentSubscription.start_date!);
        currentSubscriptionStartDate.setHours(0, 0, 0, 0);

        pastSubscriptions = subscriptions.filter((subscription) => {
            if (subscription.end_date) {
                const endDate = new Date(subscription.end_date);
                endDate.setHours(0, 0, 0, 0);
                return endDate < currentSubscriptionStartDate;
            }
            return false;
        });
    } else {
        // If no ongoing subscription, past subscriptions end before the current date
        pastSubscriptions = subscriptions.filter((subscription) => {
            if (subscription.end_date) {
                const endDate = new Date(subscription.end_date);
                endDate.setHours(0, 0, 0, 0);
                return endDate < now;
            }
            return false;
        });
    }

    // Sort past subscriptions by start_date in descending order (most recent past first)
    pastSubscriptions.sort((a, b) => {
        if (!a.start_date || !b.start_date) return 0;
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    });

    return pastSubscriptions.length == 0 ? null : pastSubscriptions;
}
