'use server';

import {
  generateCustomCleaningPlan,
  type GenerateCustomCleaningPlanInput,
  type GenerateCustomCleaningPlanOutput,
} from '@/ai/flows/generate-custom-cleaning-plan';

export async function getCustomPlan(
  input: GenerateCustomCleaningPlanInput
): Promise<GenerateCustomCleaningPlanOutput> {
  try {
    const plan = await generateCustomCleaningPlan(input);
    return plan;
  } catch (error) {
    console.error('Error generating custom cleaning plan:', error);
    throw new Error(
      'We had trouble generating your plan. Please check your inputs or try again later.'
    );
  }
}
