'use server';
/**
 * @fileOverview An AI agent for generating custom cleaning plans.
 *
 * - generateCustomCleaningPlan - A function that handles the generation of a custom cleaning plan.
 * - GenerateCustomCleaningPlanInput - The input type for the generateCustomCleaningPlan function.
 * - GenerateCustomCleaningPlanOutput - The return type for the generateCustomCleaningPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCustomCleaningPlanInputSchema = z.object({
  propertySize: z.string().describe('The size of the property to be cleaned (e.g., small, medium, large).'),
  typeOfCleaning: z.string().describe('The type of cleaning service required (e.g., deep cleaning, standard cleaning, move-in/move-out cleaning).'),
  frequency: z.string().describe('The desired frequency of cleaning (e.g., weekly, bi-weekly, monthly, one-time).'),
  budget: z.string().describe('The budget for the cleaning service (e.g., budget-friendly, standard, premium).'),
  specificRequirements: z.string().optional().describe('Any specific cleaning requirements or add-ons (e.g., window cleaning, carpet cleaning, green cleaning).'),
});
export type GenerateCustomCleaningPlanInput = z.infer<typeof GenerateCustomCleaningPlanInputSchema>;

const GenerateCustomCleaningPlanOutputSchema = z.object({
  cleaningPlan: z.string().describe('A detailed custom cleaning plan based on the user input.'),
  estimatedCost: z.string().describe('The estimated cost for the generated cleaning plan.'),
  estimatedDuration: z.string().describe('The estimated duration for the generated cleaning plan.'),
});
export type GenerateCustomCleaningPlanOutput = z.infer<typeof GenerateCustomCleaningPlanOutputSchema>;

export async function generateCustomCleaningPlan(
  input: GenerateCustomCleaningPlanInput
): Promise<GenerateCustomCleaningPlanOutput> {
  return generateCustomCleaningPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCustomCleaningPlanPrompt',
  input: {schema: GenerateCustomCleaningPlanInputSchema},
  output: {schema: GenerateCustomCleaningPlanOutputSchema},
  prompt: `You are a professional cleaning service planner.

Based on the user's input, generate a custom cleaning plan with the specific requirements and budget in mind. Provide a detailed cleaning plan, the estimated cost, and the estimated duration for the service.

Property Size: {{{propertySize}}}
Type of Cleaning: {{{typeOfCleaning}}}
Frequency: {{{frequency}}}
Budget: {{{budget}}}
Specific Requirements: {{{specificRequirements}}}

Respond using the following format:
\nCleaning Plan: [Detailed cleaning plan here]
\nEstimated Cost: [Estimated cost here]
\nEstimated Duration: [Estimated duration here]`,
});

const generateCustomCleaningPlanFlow = ai.defineFlow(
  {
    name: 'generateCustomCleaningPlanFlow',
    inputSchema: GenerateCustomCleaningPlanInputSchema,
    outputSchema: GenerateCustomCleaningPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
