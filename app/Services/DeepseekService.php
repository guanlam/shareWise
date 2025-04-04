<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DeepseekService
{
    protected $apiKey;
    protected $apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = config('services.deepseek.key'); // Ensure your .env and config/services.php are set
    }

    /**
     * Get a budget suggestion from the Deepseek model.
     *
     * @param float $previousIncome The total income from the previous month.
     * @param float $previousExpense The total expense from the previous month.
     * @param float $forecastValue The forecasted expense for next month.
     * @return string
     */
    public function getBudgetSuggestion(
        float $previousIncome, 
        float $previousExpense, 
        float $forecastValue,
        array $categoryExpense
    ): string {
        // Build a dynamic prompt
        // $prompt = "A user had a total income of RM {$previousIncome} and a total expense of RM {$previousExpense} last month. " .
        //   "The forecasted expense for next month is RM {$forecastValue}. " .
        //   "Based on these figures, provide personalized budget adjustment suggestions that help the user manage their finances better. " .
        //   "Include actionable recommendations on reducing discretionary spending and improving overall savings. " .
        //   "Give the top 3 suggestions only, and output them as a numbered list with each suggestion on a new line (e.g., '...', '...', '...'). plain text, no need label 1. 2. 3. , no need style";

        $prompt = "Last Month Financial Status:\n" .
        "Total Income: RM {$previousIncome}\n" .
        "Total Expense: RM {$previousExpense}\n" .
        "Forecasted Expense for Next Month: RM {$forecastValue}\n";

        if (!empty($categoryExpense)) {
        $prompt .= "Category Breakdown:\n";
        foreach ($categoryExpense as $expense) {
            $prompt .= "{$expense['categoryName']}: RM {$expense['totalAmount']}\n";
        }
        }

        $prompt .= "\nYou are a financial advisor for ShareWise, a personal financial tracker. Based on the above financial data, provide five specific and actionable budget adjustment suggestions tailored to the user's spending habits. " .
                "For example, if the user spent a lot on Food and Drink, reference that category in the suggestion. " .
                "Each suggestion should start with a phrase like 'Based on your ...' and should clearly state a recommendation to reduce spending or improve savings. " .
                "Be concise and clear. Output your response as a plain text list with exactly five suggestions, each on a new line with no additional numbering or formatting.";


    

        Log::info("Generated Prompt: " . $prompt);
        $payload = [
            "model" => "deepseek/deepseek-r1:free", // Adjust to your chosen model
            "messages" => [
                [
                    "role" => "system",
                    "content" => "You are a helpful financial advisor."
                ],
                [
                    "role" => "user",
                    "content" => $prompt
                ]
            ],
            "temperature" => 0.7,
        ];

        $response = Http::timeout(200) // Set the timeout to 60 seconds
        ->withHeaders([
            "Authorization" => "Bearer " . $this->apiKey,
            "Content-Type" => "application/json",
        ])
        ->post($this->apiUrl, $payload);


        if ($response->successful()) {
            $result = $response->json();
            return $result['choices'][0]['message']['content'] ?? "No suggestion available.";
        }

        return "Error: Unable to retrieve suggestion.";
    }
}
