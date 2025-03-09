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

        $prompt = "A user had a total income of RM {$previousIncome} and a total expense of RM {$previousExpense} last month. " . 
        "The forecasted expense for next month is RM {$forecastValue}. ";
    
        // Add information about category expenses
        if (!empty($categoryExpense)) {
            $categoryDetails = "";
            foreach ($categoryExpense as $expense) {
                // Ensure each category has the necessary data before using it
                $categoryDetails .= "Spent RM {$expense['totalAmount']} on {$expense['categoryName']}. ";
            }
            $prompt .= $categoryDetails;
        }
        
        // Add budget suggestions
        $prompt .= "Based on these figures, provide strong and actionable budget adjustment suggestions that will help the user manage their finances better. " . 
        //    "Focus on reducing discretionary spending and improving overall savings. " . 
           "Be concise and clear, and give the top 3 suggestions only. " .
           "Format these suggestions as a plain-text, numbered list, with each suggestion on a new line using the format: ... ... ... " . 
           "Do not include labels like 1. 2. 3., and do not add any extra styling—just the plain text suggestions with a line break between them.";
    

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
