import { Subscription, SubscriptionCreationData } from '@/types';
import { API_BASE_URL } from './client';

/* -------------------------------------------------------------------------- */
/* SUBSCRIPTIONS                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Fetches all subscriptions for a specific study class.
 * @param studyClassId The ID of the study class.
 * @returns A promise that resolves to an array of Subscription objects.
 */
export async function getSubscriptionsByStudyClass(
  studyClassId: number,
): Promise<Subscription[]> {
  const response = await fetch(
    `${API_BASE_URL}/subscriptions?studyClassId=${studyClassId}`,
  );

  if (!response.ok) throw new Error('Failed to fetch subscriptions');
  return response.json();
}

/**
 * Enrolls a student in a study class by creating a new subscription.
 * @param subscriptionData An object containing the studentId and studyClassId.
 * @returns A promise that resolves to the newly created Subscription object.
 */
export async function createSubscription(
  subscriptionData: SubscriptionCreationData,
): Promise<Subscription> {
  const response = await fetch(`${API_BASE_URL}/subscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscriptionData),
  });

  if (!response.ok) throw new Error('Failed to enroll student');
  return response.json();
}
